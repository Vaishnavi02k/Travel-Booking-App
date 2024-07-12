import { Browser } from "puppeteer";
import { startLocationScrapping } from "./scrapping";

export const register = async () => {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { Worker } = await import("bullmq");
        const { connection, jobsQueue, prisma } = await import("@/src/lib");
        const puppeteer = await import("puppeteer");
        const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_9e20e8e1-zone-worldexplorer:4kl1fpiimxu3@brd.superproxy.io:9222';
        new Worker("jobsQueue", async (job) => {
            let browser: undefined | Browser = undefined;
            try {
                browser = await puppeteer.connect({
                    browserWSEndpoint: SBR_WS_ENDPOINT,
                });
                const page = await browser.newPage();
                console.log("connected! Navigating to" + job.data.url);
                await page.goto(job.data.url, { timeout: 20000 });
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
                    console.log(job.data);
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