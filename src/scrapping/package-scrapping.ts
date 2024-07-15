//@ts-nocheck
import { Page } from "puppeteer";
import { DestinationDetailsType, DestinationItineraryType, DetailedItineraryType, PackageItineraryType } from "../types/trips";

interface PackageInfo {
    id: string | null;
    name: string;
    nights: number;
    days: number;
    inclusions: string[];
    price: number;
}

interface packageDetailsType {
    description: string;
    images: string[];
    themes: string[];
    detailedItinerary: DetailedItineraryType[];
    destinationItinerary: DestinationItineraryType[];
    destinationDetails: DestinationDetailsType[];
    packageItinerary: PackageItineraryType[];
}

export const startPackageScrapping = async (page: Page, pkg: PackageInfo) => {
    const packageDetails = await page.evaluate(() => {
        const packageDetails: packageDetailsType = {
            description: "",
            images: [],
            themes: [],
            detailedItinerary: [],
            destinationItinerary: [],
            destinationDetails: [],
            packageItinerary: [],
        };
        const packageElement = document.querySelector("#main-container");
        const descriptionSelector = packageElement?.querySelector("#pkgOverView");
        const regex = new RegExp("Yatra", "gi");
        descriptionSelector?.querySelector(".readMore")?.click();
        packageDetails.description = packageElement?.querySelector("#pkgOverView p")?.innerHTML.replace(regex, "World Explorer") as string;

        packageDetails.images = Array.from(
            packageElement?.querySelectorAll(".galleryThumbImg")
        ).map((imageElement) =>
            imageElement
                .getAttribute("src")
                ?.replace("/t_holidays_responsivedetailsthumbimg", "")
        ) as string[];

        const themesSelector = packageElement?.querySelector("#packageThemes");
        packageDetails.themes = Array.from(themesSelector?.querySelectorAll("li"))
            .map((li) => li.innerText.trim());

        const dayElements = packageElement?.querySelectorAll(
            ".itineraryOverlay .subtitle"
        );

        const descriptions:DetailedItineraryType[]=[];

        dayElements?.forEach((dayElement) => {
            const title = dayElement.textContent?.trim();
            const value = [];

            //get next sibling element until next dat element
            let nextElement = dayElement.nextElementSibling;
            while (nextElement && !nextElement.classList.contains("subtitle")) {
                const textContent = nextElement.textContent?.trim();
                if (textContent) {
                    value.push(textContent);
                }
                nextElement = nextElement.nextElementSibling;
            }
            //push the title and value into result array
            descriptions.push({ title, value })

        });

        packageDetails.detailedItinerary = descriptions;

        const destinationItinerary: { place: string; totalNights: number }[] = [];

        const destinationItinerarySelector = packageElement?.querySelectorAll(".type-list li");

        destinationItinerarySelector?.forEach((element) => {
            const placeElement = element.firstChild;
            const placeText = placeElement?.textContent!.trim()
                .replace(/[\n\t]/g, "");
            const nightsElement = element.querySelector("span");
            let totalNights = 0;
            if (nightsElement) {
                const nightsText = nightsElement?.textContent!.trim();
                const nightsMatch = nightsText?.match(/\d+/);
                totalNights = nightsMatch ? parseInt(nightsMatch[0]) : 0;
            }
            destinationItinerary.push({ place: placeText, totalNights });
        });
        packageDetails.destinationItinerary = destinationItinerary;

        const cities: { name: string; description: string; image: string }[] = [];

        const readMoreButton = document.getElementById("readMore");
        if (readMoreButton) {
            readMoreButton.click();
        }

        const cityElements = document.querySelectorAll(".tabbing a");
        cityElements.forEach((cityElement) => {
            cityElement.click();
            const readMoreButtonCity = document.getElementById("readMore");
            if (readMoreButtonCity) {
                readMoreButtonCity.click();
            }
            const cityName = cityElement?.textContent?.trim();
            const cityDescription = document.getElementById("aboutDestPara")?.textContent!.trim();
            const cityImage =document.querySelector(".info-block img")!.getAttribute("src");
            cities.push({
                name: cityName,
                description: cityDescription,
                image: cityImage
            });

            packageDetails.destinationDetails = cities;
        });

        const dataExtracted: PackageItineraryType[] = [];
        const timeline = document.querySelector(".time-line .right-column");
        const articles = timeline?.querySelectorAll("article");

        articles?.forEach((article) => {
            const cityNameElement = article.querySelector(
                ".title.row.acc-title .first.ng-binding"
            );
            const cityName = cityNameElement ? cityNameElement?.textContent!.trim() : "";
            const daysSelector = article.querySelectorAll(".days.acc-content");
            const daysActivity: {
                activityType: string;
                activityDescription: string;
            }[][] = [];

            daysSelector.forEach((daySelector) => {
                const activityElements = daySelector.querySelectorAll(".items-content");
                const activities: {
                    activityType: string;
                    activityDescription: string;
                }[] = [];

                //check if any activity elements exists
                if (activityElements.length > 0) {
                    activityElements.forEach((activityElement, index) => {
                        //activity type extraction
                        const activityTypeElement =
                            activityElement.querySelector(".content.left.ico");
                        const activityType = activityTypeElement ? activityTypeElement
                            ?.textContent!.trim()
                            .split(" ")[0]
                            .split(" ")[0]
                            .split("\n")[0]
                            : `Activity ${index + 1}`;

                        let activityDescription = null;

                        if (activityType === "MEAL" || activityType === "SIGHTSEEING") {
                            const listHolder = activityElement.querySelector(".list-holder");
                            //check if list holder element is there
                            if (listHolder) {
                                //Extract all list itmes
                                const liElements = listHolder.querySelectorAll("li.ng-scope");
                                //check if list items are there
                                if (liElements.length > 0) {
                                    //Create an array to store scrapped data
                                    const scrappedData: { index: number; text: string }[] = [];

                                    //loop through each li element and extract text content

                                    liElements.forEach((liElement, index) => {
                                        const liText = liElement?.textContent!.trim();
                                        scrappedData.push({ index: index + 1, text: liText });
                                    });

                                    //log the scrapped data
                                    activityDescription = scrappedData;
                                }
                            }
                        }
                        else if (activityType === "HOTEL") {
                            const activityDescriptionElement = activityElement.querySelector(".content.right .name a");
                            activityDescription = activityDescriptionElement ? activityDescriptionElement?.textContent!.trim() : null;
                        }
                        else if (activityType === "FLIGHT") {
                            const places =
                                activityElement.querySelectorAll(".place span.full");

                            const scrappedData: string[] = [];
                            places.forEach((place) => {
                                scrappedData.push(place?.textContent!.trim());
                            });
                            activityDescription = scrappedData;
                        }

                        //log the results
                        activities.push({ activityType, activityDescription });
                    });
                }
                daysActivity.push(activities);
            });
            dataExtracted.push({
                city: cityName,
                daysActivity,
            });
        });

        packageDetails.packageItinerary = dataExtracted;

        return packageDetails;
    });
    const details = { ...pkg, ...packageDetails };
    return details;
};