
const generateForm = document.querySelector(".generate-form")
const imageGallery = document.querySelector(".image-gallery")
let isImageGenerating=false
const OPENAI_API_KEY="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"
const updateImageCard=(imgDataArray)=>{
    imgDataArray.forEach((imgObject,index)=>{
        const imgCard=imageGallery.querySelectorAll(".image-card")[index]
        const imgElement=imgCard.querySelector("img")
        const download=imgCard.querySelector('.download-btn')

        //write image src in this pattern , it is mention in openAI create image section
        const aiGeneratedImg=`data:image/jpeg;base64,${imgObject.b64_json}`
        imgElement.src=aiGeneratedImg;

        //onload event work when the loading state is end and it take a callback
        imgElement.onload=()=>{
            imgCard.classList.remove('loading')
            download.setAttribute('href',aiGeneratedImg)
            download.setAttribute('download',`${new Date().getTime()}.jpg`)
        }
});
}
const generateAiImages= async (userPrompt,userImageQantity)=>{
    try {
        const response= await fetch("https://api.openai.com/v1/images/generations",{
            method:"POST",
            headers:{
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body:JSON.stringify({
                prompt:userPrompt,
                n:parseInt(userImageQantity),
                size:"1024x1024",
                response_format:"b64_json"
            })
        })
        if(!response.ok) throw new Error("Faild to generate Images! Please try again")
        const {data}=await response.json();
        console.log(data);
        updateImageCard([...data])
    } catch (error) {
        console.log(error)
    }finally{
        isImageGenerating=false;
    }
}
const handleFormSubmission=(e)=>{
    //to prevent default senario
    e.preventDefault()
    if(isImageGenerating) return;
    isImageGenerating=true;
    //get user input and image quantity value from the form
    const userPrompt=e.srcElement[0].value
    const userImageQantity=e.srcElement[1].value
    console.log(userImageQantity)
    console.log(userPrompt)

    const imageCardMarkup=Array.from({length:userImageQantity},()=>(
        `<div class="image-card loading">
          <img
            src="bouncing-circles.svg"
            alt="image"
          /><a href="#" class="download-btn"
            ><i class="fa-solid fa-download"></i
          ></a>
        </div>`
    )).join("");
    console.log(imageCardMarkup)
    imageGallery.innerHTML=imageCardMarkup;
    generateAiImages(userPrompt,userImageQantity)
}
generateForm.addEventListener("submit",handleFormSubmission)