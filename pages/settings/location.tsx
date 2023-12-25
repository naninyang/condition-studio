import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { useMediaQuery } from 'react-responsive';
import styled from '@emotion/styled';
import useFetchData from '@/hooks/useFetchData';
import { GeocodeResponse } from '@/types';
import { addressState } from '@/state/atoms';
import { getAddressFromDB, saveAddressToDB } from '@/utils/indexedDB';
import { icons } from '@/icons';
import Seo from '@/components/Seo';
import Anchor from '@/components/Anchor';
import SettingsMenu from '@/components/Settings';
import { rem } from '@/styles/designSystem';
import styles from '@/styles/Settings.module.sass';

const BackwardIcon = styled.i({
  background: `url(${icons.ux.left}) no-repeat 50% 50%/contain`,
});

const SearchIcon = styled.i({
  background: `url(${icons.ux.search}) no-repeat 50% 50%/contain`,
});

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: `(min-width: ${rem(992)} )` });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

export default function Location() {
  const router = useRouter();
  const [loaded, setLoaded] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('loaded');
    setLoaded(storedPage);
  }, []);

  const handleBackward = () => {
    router.back();
  };

  const [address, setAddress] = useState<string>('');
  const [sidoName, setSidoName] = useState<string>('');
  const [ssgName, setSsgName] = useState<string>('');
  const [admName, setAdmName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      const data: GeocodeResponse = await response.json();

      if (response.ok && data.result?.resultdata) {
        const { sido_nm, sgg_nm, adm_nm } = data.result.resultdata[0];
        setSidoName(sido_nm);
        setSsgName(sgg_nm);
        setAdmName(adm_nm);
        setError('');

        let addressToSave = sido_nm;
        if (sgg_nm !== 'null') addressToSave += ` ${sgg_nm}`;
        if (adm_nm !== 'null') addressToSave += ` ${adm_nm}`;

        await saveAddressToDB('address', addressToSave);
      } else {
        setSidoName('');
        setError('찾는 위치가 없습니다.');
      }
    } catch (err) {
      setError('검색 중 에러가 발생했습니다.');
    }
  };

  const isDesktop = useDesktop();

  const addressData = useRecoilValue(addressState);
  const [initialAddress, setInitialAddress] = useState<string>('');

  useEffect(() => {
    const fetchAddress = async () => {
      const addressFromDB = await getAddressFromDB('address');
      const newAddress = addressFromDB ? addressFromDB : '서울 중구 을지로 12';
      setInitialAddress(newAddress);
    };

    fetchAddress();
  }, []);
  useFetchData(initialAddress);

  return (
    <div className={styles.settings}>
      <Seo pageTitle="위치설정" />
      {isDesktop && (
        <>
          <nav>
            <SettingsMenu />
          </nav>
          <hr />
        </>
      )}
      <div className={styles.content}>
        <header>
          {isDesktop ? (
            <Anchor href="/">
              <BackwardIcon />
              <span>서비스 화면으로 돌아가기</span>
            </Anchor>
          ) : (
            <>
              {loaded ? (
                <button type="button" onClick={handleBackward}>
                  <BackwardIcon />
                  <span>환경설정으로 돌아가기</span>
                </button>
              ) : (
                <Anchor href="/settings">
                  <BackwardIcon />
                  <span>환경설정으로 돌아가기</span>
                </Anchor>
              )}
            </>
          )}
          <h1>위치설정</h1>
        </header>
        <div className={styles.contain}>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>위치 검색폼</legend>
              <input
                type="search"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="찾고싶은 위치(주소) 입력"
              />
              <button type="submit">
                <SearchIcon />
                <span>검색</span>
              </button>
            </fieldset>
          </form>
          <div className={styles.notice}>
            <dl>
              <div>
                <dt>지자체 이름은 짧은이름으로 입력해 주세요.</dt>
                <dd>
                  이를테면 <code>서울특별시</code>라면 <code>서울</code>로 입력해야 합니다.
                </dd>
              </div>
              <div>
                <dt>검색시 시, 구, 동, 리 순서로 입력해야 합니다.</dt>
                <dd>
                  이를테면 <code>서울 중구 명동</code>으로 입력해야 합니다.
                </dd>
              </div>
              <div>
                <dt>지자체 이름은 필수이며, 2차 지자체를 생략하고 3차 지자체를 바로 검색할 수 없습니다.</dt>
                <dd>
                  이를테면 <code>서울 명동</code>으로 입력하면 안되고 <code>서울 중구 명동</code>으로 입력해야 합니다.
                </dd>
              </div>
            </dl>
          </div>
          {sidoName ? (
            <p className={styles.saved}>
              저장된 위치는{' '}
              <strong>
                {sidoName} {ssgName !== 'null' && <span>{ssgName}</span>} {admName !== 'null' && <span>{admName}</span>}
              </strong>{' '}
              입니다.
            </p>
          ) : (
            <>
              {addressData && (
                <>
                  <p className={styles.saved}>
                    저장된 위치는{' '}
                    <strong>
                      {addressData.sido_nm} {addressData.sgg_nm !== 'null' && <span>{addressData.sgg_nm}</span>}{' '}
                      {addressData.adm_nm !== 'null' && <span>{addressData.adm_nm}</span>}
                    </strong>{' '}
                    입니다.
                  </p>
                </>
              )}
            </>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
