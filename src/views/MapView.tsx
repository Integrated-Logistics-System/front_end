import { useEffect, useState } from "react";
import { Map } from "react-kakao-maps-sdk";

const ReactKakaoMap = () => {
    const [scriptLoad, setScriptLoad] = useState<boolean>(false);

    useEffect(() => {
        const apiKey:string|undefined = process.env.NEXT_PUBLIC_KAKAO_KEY;
        const script:HTMLScriptElement = document.createElement("script");
        
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
        document.head.appendChild(script);
    }, [])

    return (
        <div className="h-full w-full">
            <Map 
                center={{ lat: 33.5563, lng: 126.79581 }}   
                className="h-full w-full"
                level={10}>
            </Map>
        </div>
    )
}

export default ReactKakaoMap;
