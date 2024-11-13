import { useState } from "react"

export type DataType = {
    timer: string;
    distance: string;
    kcal: number;
    locationList: { lat: number; long: number; }[];
    trashList: { lat: number; long: number; }[]

}


export function useDone() {
    const [data, setData] = useState<DataType>({
        timer: "{string}",
        distance: "{string}",
        kcal: 0,
        locationList: [{ lat: 0, long: 0 }],
        trashList: [{ lat: 0, long: 0 }],
    })

    const done = (inputdata: DataType) => {
        setData({
            timer: inputdata.timer,
            distance: inputdata.distance,
            kcal: inputdata.kcal,
            locationList: inputdata.locationList,
            trashList: inputdata.trashList

        })

        localStorage.setItem("done", JSON.stringify(inputdata));

    }

    const get = (): DataType => {
        try {
            return JSON.parse(localStorage.getItem("done"))

        } catch (error) {
            return {
                timer: "{string}",
                distance: "{string}",
                kcal: 0,
                locationList: [{ lat: 0, long: 0 }],
                trashList: [{ lat: 0, long: 0 }]
            }

        }
    }

    return { done, get, data }
}