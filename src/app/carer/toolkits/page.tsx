
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
interface PlaylistItem {
  snippet: {
    title: string;
    description: string;
    resourceId: {
      videoId: string;
    };
  };
}

const YouTubePage: React.FC = () => {
  const [videos, setVideos] = useState<PlaylistItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlistIds = ['PLlGYYRUdZPJ4F_X4cMw6JruunVOTD1-r4', 'PL-VC-d9SJoOSp6uFb9AEt-BRqFbklq2-o'];
        const maxResults = 50; 
    
        const allVideos: PlaylistItem[] = [];
    
        for (const playlistId of playlistIds) {
          let nextPageToken = '';
    
          do {
            const response = await axios.get(
              `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&pageToken=${nextPageToken}`
            );
    
            const fetchedVideos = response.data.items as PlaylistItem[];
    
          
            allVideos.push(...fetchedVideos);
    
       
            nextPageToken = response.data.nextPageToken || '';
          } while (nextPageToken);
        }
    
        setVideos(allVideos);
      } catch (error) {
        console.error('Error fetching data from YouTube API:', error);
      }
    };
    

    fetchData();
  }, []); 

  const opts = {
    height: '195',
    width: '320',
    playerVars: {
      autoplay: 0,
    },
  };

  // const filteredVideos = videos.filter((video) =>
  //   video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredVideos = videos.filter((video) => {
    const titleMatch = video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase());
    const filterMatch = filterBy ? video.snippet.description.toLowerCase().includes(filterBy.toLowerCase()) : true;

    // Exclude videos with the title "Deleted video"
    const excludeDeletedVideo = video.snippet.title.toLowerCase() !== 'deleted video';

    return titleMatch && filterMatch && excludeDeletedVideo;
  });

  // return (
  //   <div>
  //     {/* <h1>YouTube Playlists</h1> */}
  //     <div style={{ marginBottom: '16px' }}>
  //       <input
  //         type="text"
  //         placeholder="Search videos by title"
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //         style={{
  //           padding: '8px',
  //           borderRadius: '4px',
  //           border: '1px solid #ccc',
  //           width: '100%',
  //         }}
  //       />
  //     </div>
  //     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
  //       {filteredVideos.map((video, index) => (
  //         <div key={index}>
  //           <YouTube videoId={video.snippet.resourceId.videoId} opts={opts} />
  //           <h3>{video.snippet.title}</h3>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
  return (
    <div>
      {/* <h1>YouTube Playlists</h1> */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search videos by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            marginBottom: '8px',
          }}
        />

        {/* <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
          }}
        >
          <option value="">Filter by...</option>
          <option value="example1">Example 1</option>
          <option value="example2">Example 2</option>
        </select> */}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredVideos.map((video, index) => (
          <div key={index}>
            <YouTube videoId={video.snippet.resourceId.videoId} opts={opts} />
            <h3>{video.snippet.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubePage;
