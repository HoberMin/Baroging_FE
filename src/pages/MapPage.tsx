import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { Map, MapMarker, Polyline } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';

import {
  CircleButton,
  OutlineButton,
  OutlineWhiteButton,
} from '../components/Button';
import { Title } from '../components/Title';
import { TopShadow } from '../components/TopShadow';
import { DataType, useDone } from '../hooks/useDone';
import formatTime from '../utils/format';
import { geolocation } from '../utils/getLocation';
import { CheckTrashPage } from './CheckTrash';

interface Location {
  lat: number | null;
  long: number | null;
}

function ImageCheckModal({ isOpen = false, children, close, addTrash }: any) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: isOpen ? 'flex' : 'none',
        backgroundColor: '#ffffff',
        zIndex: 100,
      }}
    >
      <CheckTrashPage close={close} addTrash={addTrash} />
      {children}
    </div>
  );
}

function MapPage() {
  const navigate = useNavigate();
  const { done } = useDone();

  const [firstLocation, setFirstLocation] = useState<Location>({
    lat: null,
    long: null,
  });
  const [nowLocation, setNowLocation] = useState<Location>({
    lat: null,
    long: null,
  });
  const [locationList, setLocationList] = useState<Array<Location>>([]);
  const [trashLocationList, setTrashLocationList] = useState<Array<Location>>(
    [],
  );

  const [moveLine, setMoveLine] = useState<any>();

  const [trashCount, setTrashCount] = useState(0);
  const [distance, setDistance] = useState(0);
  const [kcal, setKcal] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isClock, setIsClock] = useState(true);
  const timeRef = useRef<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const interval = 3000;
  const markerImage = '/marker.png';
  const trashMarkerImage = '/trash.png';

  const imageShowSize = 30;
  const imageSize = { width: imageShowSize, height: imageShowSize };
  const spriteSize = { width: imageShowSize, height: imageShowSize };
  const storeOrigin = { x: 0, y: 0 };

  const calculateDistance = (
    coord1: { lat: number; long: number },
    coord2: { lat: number; long: number },
  ) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLon = (coord2.long - coord1.long) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * (Math.PI / 180)) *
        Math.cos(coord2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };

  const getFirstLocation = async () => {
    const getLocation = await geolocation.get();
    if (getLocation) {
      setFirstLocation(getLocation);
      setNowLocation(getLocation);
      setLocationList([...locationList, getLocation]);
    }
  };

  const getGeoLocation = async () => {
    const getLocation = await geolocation.get();
    if (getLocation) {
      setNowLocation(getLocation);
    }
  };

  const getGeoLocationLength = () => {
    return Math.round(moveLine.getLength());
  };

  const sendRecords = async (form: DataType) => {
    try {
      const userId = localStorage.getItem('userId');

      const response = await axios.post(
        `https://k62968f39024da.user-app.krampoline.com/api/plogging-records`,
        {
          memberId: userId,
          movingCoordinates: form.locationList.map(item => {
            return {
              lat: item.lat,
              lng: item.long,
            };
          }),
          trashCoordinates: trashLocationList.map(item => {
            return {
              lat: item.lat,
              lng: item.long,
            };
          }),
          totalCalories: form.kcal,
          movingTime: duration / 1000,
          movingDistance: parseFloat(form.distance),
        },
      );

      console.log(response);
    } catch (err) {
      console.log('Error >>', err);
    }
  };

  const addTrash = async () => {
    setTrashCount(trash => trash + 1);

    const getLocation = await geolocation.get();
    setTrashLocationList([
      ...trashLocationList,
      {
        long: getLocation?.long,
        lat: getLocation?.lat,
      },
    ]);
  };

  const calculateKcal = () => {
    const kg = parseInt(JSON.parse(localStorage.getItem('userInfo')).weight);
    return (kg * distance) / 1000 + trashCount * 3;
  };

  const startTimer = () => {
    timeRef.current = setInterval(() => {
      setDuration(time => time + 1000);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timeRef.current);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClickTrash = () => {
    setIsModalOpen(true);
  };

  const handleClickStopPlogging = () => {
    const createPloggingForm = {
      locationList,
      timer:
        Math.floor(duration / 60000) +
        ':' +
        ((duration % 60000) / 1000).toFixed(0).padStart(2, '0'),
      distance: (distance / 1000).toFixed(2),
      kcal: kcal,
      trashList: trashLocationList,
    };
    sendRecords(createPloggingForm);
    done(createPloggingForm);
    navigate('/plogging/done');
  };

  const handleClickStopClock = () => {
    setIsClock(false);
    stopTimer();
  };

  const handleClickStartClock = () => {
    setIsClock(true);
    startTimer();
  };

  useEffect(() => {
    const initializeLocation = async () => {
      await getFirstLocation();
    };

    startTimer();
    initializeLocation();

    const interval1 = setInterval(() => {
      getGeoLocation();
    }, interval);

    return () => {
      stopTimer();
      clearInterval(interval1);
    };
  }, []);

  useEffect(() => {
    if (firstLocation.lat !== null && nowLocation.lat !== null) {
      if (
        (locationList.length > 0
          ? calculateDistance(
              locationList[locationList.length - 1],
              nowLocation,
            ) < 50
          : true) &&
        locationList[locationList.length - 1].lat !== nowLocation.lat &&
        locationList[locationList.length - 1].long !== nowLocation.long
      ) {
        console.log(1);
        setLocationList([...locationList, nowLocation]);
      }

      setDistance(getGeoLocationLength());
      setKcal(calculateKcal());
    }
  }, [nowLocation]);

  return (
    <>
      <Map
        center={{ lat: firstLocation.lat, lng: firstLocation.long }}
        style={{ width: '100%', height: '50vh' }}
      >
        <Polyline
          path={[
            locationList.map(item => {
              return { lat: item.lat, lng: item.long };
            }),
          ]}
          strokeWeight={10}
          strokeColor={'#7FD6E1'}
          strokeOpacity={1}
          strokeStyle={'solid'}
          onCreate={setMoveLine}
        />

        <MapMarker
          position={{ lat: nowLocation.lat, lng: nowLocation.long }}
          image={{
            src: markerImage,
            size: imageSize,
            options: {
              spriteSize: spriteSize,
              spriteOrigin: storeOrigin,
            },
          }}
        />

        {trashLocationList.map((trash: any) => (
          <MapMarker
            position={{ lat: trash.lat, lng: trash.long }}
            image={{
              src: trashMarkerImage,
              size: imageSize,
              options: {
                spriteSize: spriteSize,
                spriteOrigin: storeOrigin,
              },
            }}
          />
        ))}
      </Map>

      <b className='absolute left-2 top-2 z-10 hidden'>
        {trashCount}개의 쓰레기
      </b>

      <div className='relative bottom-0 left-0 z-10 h-1/2 w-full bg-white'>
        <TopShadow />

        <div className='absolute flex px-6 pt-2' style={{ top: '0px' }}>
          <Title>
            플로깅으로{' '}
            <b style={{ color: '#7FD6E1' }}>{trashCount * 3} kcal </b> <br></br>{' '}
            더 태우는중
          </Title>
        </div>

        <div className='flex pt-2'>
          <div className='flex flex-1 flex-col items-center justify-center gap-2'>
            <b>{formatTime(duration / 1000)}</b>
            <p style={{ color: '#828282' }}>시간</p>
          </div>
          <div className='flex flex-1 flex-col items-center justify-center gap-3'>
            <b style={{ fontSize: '1.5rem' }}>{Math.round(kcal)}kcal</b>
            <p style={{ fontSize: '1.15rem' }}>칼로리</p>
          </div>

          <div className='flex flex-1 flex-col items-center justify-center gap-3'>
            <b>{distance / 1000}km</b>
            <p style={{ color: '#828282', fontSize: '1.15rem' }}>거리</p>
          </div>
        </div>

        <div className='absolute bottom-6 flex w-full gap-10 pt-2'>
          <div className='flex flex-1 justify-end'>
            {isClock ? (
              <CircleButton onClick={handleClickStopClock}>
                <span className='material-symbols-outlined text-[50px]'>
                  pause
                </span>
              </CircleButton>
            ) : (
              <CircleButton color='#7FD6E1' onClick={handleClickStartClock}>
                <span className='material-symbols-outlined text-[50px]'>
                  play_arrow
                </span>
              </CircleButton>
            )}
          </div>
          <div
            className='flex flex-1 justify-start'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {isClock ? (
              <OutlineButton onClick={handleClickTrash}>쓰레기</OutlineButton>
            ) : (
              <OutlineWhiteButton onClick={handleClickStopPlogging}>
                종료
              </OutlineWhiteButton>
            )}
          </div>
        </div>
      </div>
      <ImageCheckModal
        isOpen={isModalOpen}
        close={closeModal}
        addTrash={addTrash}
      >
        {/* <div>
            <CircleButton onClick={setIsModalOpen(() => !isModalOpen)}><span className="material-symbols-outlined">
              close
            </span></CircleButton>
          </div> */}
      </ImageCheckModal>
    </>
  );
}

export default MapPage;
