export async function callAPI(apiRoute: string) {
    const response = await fetch(apiRoute);

    if (!response.ok) {
        console.log("Unable to service API Route Handler Request for", apiRoute);
        return ""
    }

    const option = await response.json();
    return option;
}