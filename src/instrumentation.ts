import { Browser } from "puppeteer";
import { startLocationScrapping, startPackageScrapping } from "./scrapping";

export const register = async () => {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { Worker } = await import("bullmq");
        const { connection, jobsQueue, prisma } = await import("@/src/lib");
        const puppeteer = await import("puppeteer");
        const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_fe677fb1-zone-explorer:je45vvmy4f8p@brd.superproxy.io:9222';
        new Worker("jobsQueue", async (job) => {
            let browser: undefined | Browser = undefined;
            try {
                browser = await puppeteer.connect({
                    browserWSEndpoint: SBR_WS_ENDPOINT,
                });
                const page = await browser.newPage();
                console.log("connected! Navigating to" + job.data.url);
                await page.goto(job.data.url, { timeout: 60000 });
                console.log("Navigated! Scrapping page content....");
                if (job.data.jobType.type === "location") {

                    const packages = await startLocationScrapping(page);
                    await prisma.jobs.update({
                        where: { id: job.data.id }, data: { isComplete: true, status: "complete" }
                    });

                    for (const pkg of packages) {
                        const jobCreated = await prisma.jobs.findFirst({
                            where: {
                                url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                            },
                        });
                        if (!jobCreated) {
                            const job = await prisma.jobs.create({
                                data: {
                                    url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
                                    jobType: { type: "package" },
                                },
                            });
                            jobsQueue.add("package", { ...job, packageDetails: pkg });
                        }
                    }
                }
                else if (job.data.jobType.type === "package") {
                    //already scraped check
                    const alreadyScrapped = await prisma.trips.findUnique({
                        where: { id: job.data.packageDetails.id },
                    });
                    //scrape the package
                    if (!alreadyScrapped) {
                        //store the package in trips model
                        const pkg = await startPackageScrapping(
                            page,
                            job.data.packageDetails
                        );
                        // console.log(pkg);
                        await prisma.trips.create({data: pkg });
                        //mark the job complete 
                        await prisma.jobs.update({
                            where: { id: job.data.id },
                            data: { isComplete: true, status: "complete" },
                        })
                    }
                }
            } catch (error) {
                console.log(error);
                await prisma.jobs.update({
                    where: { id: job.data.id }, data: { isComplete: true, status: "failed" }
                });
            }
            finally {
                await browser?.close();
                console.log("Browser closed successfully.")
            }

        }, {
            connection, concurrency: 10,
            removeOnComplete: { count: 1000 },
            removeOnFail: { count: 5000 },
        });
    }
};