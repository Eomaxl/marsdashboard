const $$ = (selector) => document.querySelector(selector);
const $$$ = (elem) => document.createElement(elem);

class Rover {
    constructor(roverData) {
        this.roverName = roverData.image.photos[0].rover.name;
        this.launchDate = roverData.image.photos[0].rover.launch_date;
        this.landingDate = roverData.image.photos[0].rover.landing_date;
        this.roverStatus = roverData.image.photos[0].rover.status;
        this.recentDate = roverData.image.photos[0].earth_date;
        this.imageSources = this.getLimitedRoverImagesSource(roverData);
    }

    getLimitedRoverImagesSource(roverDataResponse) {
        const roverData = JSON.parse(JSON.stringify(roverDataResponse));
        const limitedRoverImages = roverData.image.photos.splice(1, 20);
        return limitedRoverImages.map(this.getRoverImageSource);
    }

    getRoverImageSource(roverImage) {
        return roverImage.img_src;
    }
}

const processUI = async (roverName, callBack) =>{
    const data = await getRoverData(roverName);
    callBack(data);
};

const getRoverData = async(roverName) => {

    const res = await fetch(`http://localhost:3000/nasaAPI`, {
        headers: {
            'roverName': roverName,
        }
    });
    const data = await res.json();
    if (!data.image.hasOwnProperty("errors")) {
        return processRoverData(data);
    }
    return data;
}

const processRoverData = ((responseData) => {
    const roverData = JSON.parse(JSON.stringify(responseData));
    return new Rover(roverData);;
});

const createDynamicUI = (roverData) => {

    if (roverData.hasOwnProperty("image")) {
        handleError();
    }
    else {
        const roverName = $$("#roverName");
        const launchDate = $$("#launchDate");
        const landingDate = $$("#landingDate");
        const status = $$("#status");
        const recentDate = $$("#recentDate");
        const imageGallery = $$("#roverImages");
        const roverMetaInfo = $$("#roverMetaInfo");
        const roverImages = $$("#roverImages");
        const errorBox = $$("#errorBox");
        
        roverName.innerHTML = roverData.roverName;
        launchDate.innerHTML = roverData.launchDate;
        landingDate.innerHTML = roverData.landingDate;
        status.innerHTML = roverData.roverStatus;
        recentDate.innerHTML = roverData.recentDate;
        imageGallery.innerHTML = "";

        for (let roverImage of roverData.imageSources) {
            let imageEle = $$$("img");
            imageEle.setAttribute("src", roverImage)
            imageEle.setAttribute("class", "col-md-3 my-3");
            imageGallery.appendChild(imageEle);
        }
        roverMetaInfo.style.visibility = 'visible';
        roverImages.style.visibility = 'visible';
        errorBox.style.visibility = 'collapse';
    }
}

const handleError = () => {
    const roverMetaInfo = $$("#roverMetaInfo");
    const errorBox = $$("#errorBox");
    const imageGallery = $$("#roverImages");

    errorBox.style.color = "red";
    errorBox.innerHTML = "Error may be due to NASA API is not working properly.";
    errorBox.style.visibility = 'visible';
    roverMetaInfo.style.visibility = 'collapse';
    imageGallery.style.visibility = 'collapse';
}