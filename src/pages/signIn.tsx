import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Title } from '../components/Title';
import { cn } from '../utils/cn';

const SignInPage = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const navigate = useNavigate();
  const userINFO = localStorage.getItem('userInfo');

  useEffect(() => {
    if (userINFO) {
      navigate('/');
    }
  }, [userINFO, navigate]);

  const handleOnHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
    setHeight(value);
  };

  const handleOnWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
    setWeight(value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!height || !weight || !gender) {
      alert('모든 값을 입력해주세요');
      return;
    }

    const formData = {
      height,
      weight,
      gender,
    };

    localStorage.setItem('userInfo', JSON.stringify(formData));
    alert('성공적으로 저장되었습니다');
    navigate('/');
  };

  return (
    <div className='flex h-full flex-col'>
      <form onSubmit={handleSubmit}>
        <div className='flex h-full flex-col gap-8 p-6 pt-10'>
          <Title>기본 정보를 입력해 주세요.</Title>
          <div className='flex items-center gap-4'>
            <div className='relative flex w-full items-center'>
              <input
                className='w-full rounded-[8px] rounded-lg border border border-[#E0E0E0] px-4 py-3'
                value={height}
                onChange={handleOnHeightChange}
                placeholder='키'
                type='text'
              />
              <span className='absolute right-[80px]'>
                {height ? 'cm' : ''}
              </span>
            </div>
            <div className='relative flex w-full items-center'>
              <input
                className='w-full rounded-[8px] rounded-lg border border border-[#E0E0E0] px-4 py-3'
                value={weight}
                onChange={handleOnWeightChange}
                placeholder='체중'
                type='text'
              />
              <span className='absolute right-[80px]'>
                {weight ? 'kg' : ''}
              </span>
            </div>
          </div>
          <select
            className='w-full rounded-lg border p-3'
            style={{ border: '0.1rem solid #E0E0E0' }}
            onChange={e => setGender(e.target.value)}
            value={gender}
          >
            <option value=''>성별을 선택하세요</option>
            <option value='man'>남성</option>
            <option value='woman'>여성</option>
          </select>
          <div className='w-full grow p-10'></div>
        </div>
        <div className='absolute bottom-2 flex w-full items-center justify-center p-6'>
          <button
            className={cn('w-full rounded-md p-3 text-[#FFFFFF]', {
              'cursor-not-allowed bg-[#C1C1C1]': !height || !weight,
              'bg-[#7FD6E1]': height && weight,
            })}
            disabled={!height || !weight}
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
