document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "AIzaSyDgyMdcqE2mHW304dmESqJsxy-2XEgb1qs";
    const videoEndpoint = "https://www.googleapis.com/youtube/v3/videos?";
    const channelEndpoint = "https://www.googleapis.com/youtube/v3/channels?";
  
    const fetchData = async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchVideoData = async () => {
      try {
        const videoData = await fetchData(
          videoEndpoint +
            new URLSearchParams({
              key: apiKey,
              part: "snippet",
              chart: "mostPopular",
              maxResults: 50,
              regionCode: "IN",
            })
        );
  
        for (const videoItem of videoData.items) {
          await fetchChannelIcon(videoItem);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchChannelIcon = async (videoData) => {
      try {
        const channelData = await fetchData(
          channelEndpoint +
            new URLSearchParams({
              key: apiKey,
              part: "snippet",
              id: videoData.snippet.channelId,
            })
        );
  
        videoData.channelThumbnail =
          channelData.items[0].snippet.thumbnails.default.url;
        await createVideoCard(videoData);
      } catch (error) {
        console.log(error);
      }
    };
  
    
    const createVideoCard = async (videoData) => {
    try {
      // Fetch video statistics
      const statsData = await fetchData(
        videoEndpoint +
          new URLSearchParams({
            key: apiKey,
            part: "statistics",
            id: videoData.id,
          })
      );
  
      // Extract likes count and updated date
      const likes = statsData.items[0].statistics.likeCount;
      const updatedDate = videoData.snippet.publishedAt;
  
      // Get the resultDiv element
      const resultDiv = document.getElementById("resultDiv");
  
      // Create the video card container
      const videoCard = document.createElement("div");
      videoCard.classList.add("video");
  
      // Create the embedded video frame
      const videoFrame = document.createElement("iframe");
      videoFrame.width = "360";
      videoFrame.height = "215";
      videoFrame.src = `https://www.youtube.com/embed/${videoData.id}`;
      videoFrame.frameBorder = "0";
      videoFrame.allowFullscreen = true;
      videoCard.appendChild(videoFrame);
  
     
      const contentDiv = document.createElement("div");
      contentDiv.classList.add("content");
      videoCard.appendChild(contentDiv);
  
  
      const channelIconImg = document.createElement("img");
      channelIconImg.src = videoData.channelThumbnail;
      channelIconImg.classList.add("channel-icon");
      contentDiv.appendChild(channelIconImg);
  
      
      const infoDiv = document.createElement("div");
      infoDiv.classList.add("info");
      contentDiv.appendChild(infoDiv);
  
      
      const titleH4 = document.createElement("h4");
      titleH4.classList.add("title");
      titleH4.innerText = videoData.snippet.title;
      infoDiv.appendChild(titleH4);
  
      // Create the channel name paragraph
      const channelNameP = document.createElement("p");
      channelNameP.classList.add("channel-name");
      channelNameP.innerText = videoData.snippet.channelTitle;
      infoDiv.appendChild(channelNameP);
  
      
      const likesP = document.createElement("p");
      likesP.classList.add("likes");
      likesP.innerText = `Likes: ${likes}`;
      infoDiv.appendChild(likesP);
  
      
      const updatedDateP = document.createElement("p");
      updatedDateP.classList.add("updated-date");
      updatedDateP.innerText = `Updated: ${updatedDate}`;
      infoDiv.appendChild(updatedDateP);
  
      
      videoCard.addEventListener("click", () => {
        openVideoInNewTab(videoData.id);
      });
  
     
      resultDiv.appendChild(videoCard);
    } catch (error) {
      console.log(error);
    }
  };
  
   
    
    const openVideoInNewTab = (videoId) => {
      window.open(`https://youtube.com/watch?v=${videoId}`, "_blank");
    };
  
    const searchBtn = document.getElementById("searchButton");
  
    
    
    searchBtn.addEventListener("click",fetchDatadisplay);
  
    
  
  async function fetchDatadisplay() {
    const searchInput = document.getElementById("searchbox").value;
  
    let endpoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${searchInput}&key=${apiKey}`;
  
    try {
      let response = await fetch(endpoint);
      let data = await response.json();
  
      let resultDiv = document.getElementById("resultDiv");
      resultDiv.innerHTML = "";
  
      let videos = data.items;
      for (const video of videos) {
        let videoId = video.id.videoId;
        let title = video.snippet.title;
        
        let channelProfile = video.snippet.channelTitle;
  
        let videoElement = document.createElement("div");
        videoElement.className = "video-container";
        videoElement.innerHTML = `
          <div>
            <iframe width="360" height="215" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            <h3>${title}</h3>
            
            <p>Channel Profile: ${channelProfile}</p>
          </div>
        `;
  
        resultDiv.appendChild(videoElement);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
    fetchVideoData();
  });
  