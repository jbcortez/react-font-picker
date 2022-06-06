import React, { useEffect, useRef, useState } from 'react';
import { getGoogleFontsList } from './services';
import { GFONTS_BASE_URL } from './constants';
import { loadPreviewStylesheet, loadStylesheet } from './loadStylesheet';
import chevronDown from '../assets/chevron.svg';
import useDelayUnmount from './useDelayUnmount';
import '../index.css';

interface Props {
  value: string;
  id?: string;
  apiKey: string;
  onChange: (value: string, e: React.MouseEvent) => void;
  limit?: number;
  sort?: 'alpha' | 'popularity';
  fontSize?: number;
  style?: React.CSSProperties;
}

const mountedStyle = { animation: 'slidein 200ms ease-in forwards' };
const unmountedStyle = {
  animation: 'slideout 200ms ease-in forwards',
};

export const FontPicker: React.FC<Props> = ({
  value,
  id,
  apiKey,
  onChange,
  limit = 250,
  sort,
  fontSize = 14,
  style,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [fonts, setFonts] = useState<{ family: string }[]>([]);
  const [activeFontURL, setActiveFontURL] = useState<string | null>(null);
  const [previewFontURL, setPreviewFontURL] = useState<string | null>(null);
  const isOptionsOpen = useDelayUnmount(isMounted, 250);

  const hasRendered = useRef(false);

  const handleChange: React.MouseEventHandler<HTMLLIElement> = (e) => {
    const target = e.target as HTMLLIElement;
    onChange(target.innerText, e);
    setIsMounted(!isMounted);
  };

  // Select option when pressing enter
  const handlePressEnter = (e: any) => {
    if (e.key === 'Enter') {
      handleChange(e);
    }
  };

  // Fetch the fonts from the API
  useEffect(() => {
    if (!hasRendered.current) {
      getGoogleFontsList(apiKey).then((res) => {
        setFonts(res.splice(0, limit));
      });
    }

    return () => {
      hasRendered.current = true;
    };
  }, []);

  // Sort fonts by popularity or alphabetical
  useEffect(() => {
    if (sort === 'alpha') {
      setFonts(fonts.sort((a, b) => a.family.localeCompare(b.family)));
    } else {
      getGoogleFontsList(apiKey).then((res) => {
        setFonts(res.splice(0, limit));
      });
    }
  }, [sort]);

  // Set the active font URL
  useEffect(() => {
    setActiveFontURL(
      `${GFONTS_BASE_URL}${value.replaceAll(' ', '+')}&display=swap`
    );
  }, [value]);

  // Generate the preview fonts URL
  useEffect(() => {
    let previewURL = '';
    let isComplete = false;
    if (fonts.length > 0) {
      for (let i = 0; i < fonts.length; i++) {
        previewURL += `${fonts[i].family}&family=`;

        if (i === fonts.length - 1) {
          isComplete = true;
        }
      }
    }

    if (isComplete) {
      setPreviewFontURL(
        GFONTS_BASE_URL +
          previewURL.replaceAll(' ', '+').slice(0, previewURL.length - 8) +
          '&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz12&display=swap'
      );
    }
  }, [fonts]);

  // load preview stylesheet
  useEffect(() => {
    if (previewFontURL) {
      loadPreviewStylesheet(previewFontURL);
    }
  }, [previewFontURL]);

  // Load the active font stylesheet
  useEffect(() => {
    if (activeFontURL) {
      loadStylesheet(activeFontURL, value);
    }
  }, [activeFontURL]);

  return (
    <div className='font-picker' id={id} style={style}>
      <div
        className={`font-picker-input ${isOptionsOpen ? 'show-options' : ''}`}
        style={{ fontSize: fontSize }}
        aria-haspopup='listbox'
        aria-expanded={isOptionsOpen}
        onClick={() => setIsMounted(!isMounted)}>
        {value}
        <img className='icon' src={chevronDown} alt={'Chevron Down Icon'} />
      </div>

      {isOptionsOpen && (
        <ul
          className='font-picker-options'
          role='listbox'
          style={isMounted ? mountedStyle : unmountedStyle}
          aria-activedescendant={value}
          tabIndex={-1}>
          {fonts.length > 0 &&
            fonts.map((font, i) => (
              <li
                className={`font-picker-option ${
                  font.family === value ? 'active' : ''
                }`}
                key={font.family + String(i)}
                style={{ fontSize: fontSize, fontFamily: font.family }}
                id={font.family}
                role='option'
                aria-selected={value === font.family}
                onKeyDown={handlePressEnter}
                onClick={handleChange}
                tabIndex={0}>
                {font.family}
              </li>
            ))}
        </ul>
      )}

      {isOptionsOpen && (
        <div
          className='backdrop'
          onClick={() => setIsMounted(!isMounted)}></div>
      )}
    </div>
  );
};
