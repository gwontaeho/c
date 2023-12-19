"use client";

import { useEffect } from "react";

export const Map = ({ latitude, longitude }) => {
    useEffect(() => {
        if (window.kakao)
            kakao.maps.load(() => {
                const container = document.getElementById("map");
                const options = {
                    center: new kakao.maps.LatLng(latitude, longitude),
                    level: 3,
                };
                const map = new kakao.maps.Map(container, options);

                const markerPosition = new kakao.maps.LatLng(latitude, longitude);
                const marker = new kakao.maps.Marker({ position: markerPosition });
                marker.setMap(map);
            });
    }, []);

    return <div id="map" className="w-full h-full" />;
};
