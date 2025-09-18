// src/components/youtube/CursoDetalhes.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiYoutube } from "./apiyoutube";
import VideoPlayer from "./VideoPlayer";

export default function CursoDetalhes() {
    const { id } = useParams(); // curso_id
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        apiYoutube.getVideos(id).then(setVideos).catch(console.error);
    }, [id]);

    return (
        <div className="curso-detalhes">
            <h2>Curso #{id}</h2>
            {videos.map((video) => (
                <VideoPlayer key={video.id} video={video} />
            ))}
        </div>
    );
}
