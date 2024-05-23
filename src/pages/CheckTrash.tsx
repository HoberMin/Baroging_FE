
import { useState, useEffect, useRef } from "react";
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl';


function Main({ close }: any) {
    const [predictAccuracy, setAccuracy] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isUpload, setIsUpload] = useState(false)

    const imageRef: any = useRef()

    // useEffect(() => {
    //     predict()
    // }, [])


    const predict = async () => {
        setIsLoading(true)
        setIsUpload(true)
        const img: any = imageRef.current
        const model = await mobilenet.load();
        const predictions: any = await model.classify(img);

        setAccuracy(predictions)
    }

    const predictionsMap = predictAccuracy.map((item: any) => {
        return <PredictAccuracyItem name={item.className} probability={item.probability}></PredictAccuracyItem>
    })

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // const startWebcam = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({
    //             video: {
    //                 facingMode: { exact: "environment" },
    //             },
    //         });
    //         if (videoRef.current) {
    //             videoRef.current.srcObject = stream;
    //             videoRef.current.oncanplaythrough = () => {
    //                 if (canvasRef.current && videoRef.current) {
    //                     canvasRef.current.width = videoRef.current.videoWidth;
    //                     canvasRef.current.height = videoRef.current.videoHeight;
    //                     drawVideoToCanvas();
    //                 }
    //             };
    //         }
    //     } catch (err) {
    //         console.error('Error accessing webcam: ', err);
    //     }
    // };

    const drawVideoToCanvas = () => {
        try {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            requestAnimationFrame(drawVideoToCanvas);
        } catch (error) { }
    };

    useEffect(() => {


        //startWebcam();
    }, []);

    useEffect(() => {
        if (!!predictAccuracy) {
            setIsLoading(false)

            setTimeout(() => {
                close()
                if (isUpload) {

                    setAccuracy([])
                    setIsUpload(false)
                    const context = canvasRef.current.getContext('2d');
                    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }

            }, 3000)
        }
    }, [predictAccuracy])



    // const handleClickTakePicture = () => {
    //     imageRef.current.src = canvasRef.current.toDataURL('image/png');
    //     predict()
    // }


    return (
        <header className="bg-white h-100">
            <div className="pt-4 p-6">
                <video ref={videoRef} style={{ display: 'none', width: "100%" }} autoPlay playsInline />
                <canvas style={{ width: "100%", border: "0.1rem solid #7FD6E1", borderRadius: "0.25rem", backgroundColor: "#7FD6E11A" }} ref={canvasRef}></canvas>

            </div>



            <div className="absolute p-6 bottom-2 w-full justify-center flex">
                <FileUpload canvas={canvasRef} image={imageRef} predict={predict}></FileUpload>
            </div>

            <img
                src="/dog.jpg"
                className="hidden"
                ref={imageRef}
                width="224"
            ></img>
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <span className="material-symbols-outlined animate-spin ">
                        progress_activity
                    </span>
                </div>

            ) : (
                <>
                    {predictionsMap}
                </>

            )}

        </header>
    );
}

function PredictAccuracyItem({ name, probability }: any) {
    return (
        <div className="bg-light p-2 mb-1" role="alert">
            {name} <span className="material-symbols-outlined">chevron_right</span> {probability.toFixed(4)}% 일치율
        </div>
    )
}

function FileUpload({ canvas, image, predict }: any) {
    const [file, setFile] = useState()
    const fileRef = useRef()

    const handleFileChange = (e: any) => {
        if (!e.target.files) {
            return 0
        }

        const uploadFile = e.target.files[0]

        setFile(uploadFile)
        changeFile(uploadFile)
        console.log(file)
    }

    const changeFile = (uploadFile: any) => {
        const fileUrl = fileToUrl(uploadFile)
        image.current.src = fileUrl

        const context = canvas.current.getContext('2d');

        var img = new Image();
        img.onload = function () {
            context.drawImage(image.current, 0, 0, canvas.current.width, canvas.current.height);
        }
        img.src = fileUrl
        sendToPredict()
    }

    const fileToUrl = (targetFile: any) => {
        const url = URL.createObjectURL(targetFile)
        return url
    }

    const sendToPredict = () => {
        predict()
    }

    const handleClickUpload = () => {
        const fileC: any = fileRef.current
        fileC.click()
    }

    return (
        <div className="mb-3 w-full">
            <label htmlFor="formFile " className="form-label hidden">예측할 파일 업로드</label>
            <input className="form-control hidden" type="file" ref={fileRef} id="formFile" onChange={handleFileChange} />

            <button onClick={handleClickUpload} className='w-full bg-gray-400 p-3 rounded-md text-gray-50'>
                인증하기
            </button>
        </div>
    )
}


export function CheckTrashPage({ close }: any) {
    return (
        <div className="w-full">
            <span className="material-symbols-outlined p-4" onClick={close}>
                arrow_back_ios
            </span>
            <h2 className="text-2xl p-4">쓰레기 사진을 찍어 인증해 주세요</h2>

            <Main close={close}></Main>
        </div>
    )
}