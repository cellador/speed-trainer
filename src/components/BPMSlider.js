import React, { useState } from 'react';
import SwiperCore, { Virtual, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import "swiper/css/scrollbar";

import './BPMSlider.css';

// install Virtual module
SwiperCore.use([Virtual]);

export default function BPMSlider(props) {
  const [swiperRef, setSwiperRef] = useState(null);
  const [slides, setSlides] = useState(
    Array.from({ length: props.to-props.from+1 }).map((_, index) => index + props.from)
  );
  const clamp = (num) => Math.min(Math.max(num, props.from), props.to);
  return (
    <>
      <Swiper
        slidesPerView={5}
        centeredSlides={true}
        spaceBetween={0}
        initialSlide={props.default-props.from}
        onSwiper={setSwiperRef}
        modules={[Scrollbar]}
        scrollbar={{
          hide: false,
          draggable: true,
          dragSize: 20
        }}
        onSlideChange={(swiperCore) => {
          const { realIndex } = swiperCore;
          props.callback(realIndex + props.from);
        }}
        onClick={(swiperCore) => {
          const { clickedIndex } = swiperCore;
          swiperCore.slideTo(clickedIndex);
        }}
        onDoubleClick={(swiperCore) => {
          const bpm = parseInt(prompt("BPM", "60"), 10);
          if (!isNaN(bpm)) {
            swiperCore.slideTo(clamp(bpm)-props.from);
            props.callback(clamp(bpm));
          }
        }}
        virtual
      >
        {slides.map((slideContent, index) => (
          <SwiperSlide key={slideContent} virtualIndex={index}>
            {slideContent}
          </SwiperSlide>
          
        ))}
        <span className="label">BPM</span>
      </Swiper>
    </>
  );
}