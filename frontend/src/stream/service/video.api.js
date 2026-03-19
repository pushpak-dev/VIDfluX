import axios from 'axios';  


const api = axios.create({
    baseURL:'/api',
    withCredentials:true,
})


export const getVideoInfo = async (videoUrl) =>{
    try {
        const response = await api.get('/stream/info', {
            params: { url: videoUrl }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching video info:', error);
        throw error;
    }
    }

  export const downloadVideo = (videoUrl)=>{
   window.open(
    `http://localhost:3000/api/stream?url=${encodeURIComponent(videoUrl)}`,
    '_blank'
   )
  }  
