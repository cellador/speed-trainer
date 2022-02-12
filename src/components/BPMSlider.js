import React from 'react';
import { FreeMode, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import "swiper/css/scrollbar";

import './BPMSlider.css';

export default function BPMSlider(props) {
  const slides = Array.from({ length: props.to-props.from+1 }).map((_, index) => index + props.from);
  const clamp = (num) => Math.min(Math.max(num, props.from), props.to);
  return (
    <>
      <Swiper
        slidesPerView={5}
        centeredSlides={true}
        spaceBetween={0}
        initialSlide={props.default-props.from}
        modules={[FreeMode, Scrollbar]}
        scrollbar={{
          hide: false,
          draggable: true,
          dragSize: 20
        }}
        speed={100}
        freeMode={{
          enabled: true,
          sticky: true,
          minimumVelocity: 0.3,
          momentumRatio: 0.4,
        }}
        onSlideChange={({ realIndex }) => {
          props.callback(realIndex + props.from);
        }}
        onClick={(swiperCore) => {
          const { clickedIndex } = swiperCore;
          swiperCore.slideTo(clickedIndex);
        }}
        onDoubleClick={(swiperCore) => {
          // const slide = swiperCore.clickedSlide;
          // console.log(swiperCore);
          // slide.innerHTML = "";
          // var inputBPM = createInputBPM();
          // slide.appendChild({inputBPM});
          // inputBPM.focus();
          // const bpm = parseInt(pro, 10);
          const bpm = parseInt(prompt("Enter BPM", "60"), 10);
          if (!isNaN(bpm)) {
            swiperCore.slideTo(clamp(bpm)-props.from);
            props.callback(clamp(bpm));
          }
        }}
      >
        {slides.map((content, index) => (
          <SwiperSlide key={index}>
            {content}
          </SwiperSlide>
        ))}
        <span className="label">BPM</span>
      </Swiper>
    </>
  );
}