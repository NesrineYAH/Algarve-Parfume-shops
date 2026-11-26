
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styled from "styled-components";

// Images desktop
import slide1 from "../../assets/images/nature11.png";
import slide2 from "../../assets/images/nature2.png";
import slide3 from "../../assets/images/nature31.png";
import slide4 from "../../assets/images/nature4.png";

// Images mobile
import slide1Mobile from "../../assets/images/nature1-mobile.png";
import slide2Mobile from "../../assets/images/nature2-mobile.png";
import slide3Mobile from "../../assets/images/nature3-mobile.png";
import slide4Mobile from "../../assets/images/nature4-mobile.png";

const slides = [
  { desktop: slide1, mobile: slide1Mobile },
  { desktop: slide2, mobile: slide2Mobile },
  { desktop: slide3, mobile: slide3Mobile },
  { desktop: slide4, mobile: slide4Mobile },
];

const CarouselWrapper = styled.div`
  width: 100%;
  margin: 0 auto;

  .swiper {
    width: 100%;
    height: 700px;
    border-radius: 12px;
    overflow: hidden;
  }

  .swiper-slide {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  picture {
    display: block;
    width: 100%;
    height: 100%;
  }

  .slide-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
    object-position: center;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    background: rgba(0, 0, 0, 0.35);
    width: 42px;
    height: 42px;
    border-radius: 50%;
    transition: background 0.2s;

    &:hover {
      background: rgba(0, 0, 0, 0.6);
    }

    &::after {
      font-size: 18px;
    }
  }

  .swiper-pagination-bullet {
    background: white;
    opacity: 0.7;
  }

  .swiper-pagination-bullet-active {
    background: #c99a42;
    opacity: 1;
  }

  /* Version mobile */
  @media (max-width: 768px) {
    .swiper {
      height: 800px;
      border-radius: 8px;
    }

    .slide-image {
      border-radius: 8px;
    }

    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }

    .swiper-pagination {
      bottom: 8px !important;
    }

    .swiper-pagination-bullet {
      width: 7px;
      height: 7px;
    }
  }
`;

export default function CarouselPro() {
  return (
    <CarouselWrapper>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet={slide.mobile}
              />

              <img
                src={slide.desktop}
                alt={`Perfume Algarve - Bannière ${index + 1}`}
                className="slide-image"
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </CarouselWrapper>
  );
}











/*
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styled from "styled-components";
import slide1 from "../../assets/images/nature1.png";
import slide2 from "../../assets/images/nature2.png";
import slide3 from "../../assets/images/nature3.png";
import slide4 from "../../assets/images/nature4.png";


const slides = [slide1, slide2, slide3, slide4];

const CarouselWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  .swiper {
    border-radius: 12px;
    overflow: hidden;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 100%;
    height: 500px;
    object-fit: unset;
    border-radius: 12px;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    background: rgba(0,0,0,0.35);
    padding: 15px;
    border-radius: 50%;
    transition: 0.2s;

    &:hover {
      background: rgba(0,0,0,0.55);
    }
  }

  .swiper-pagination-bullet {
    background: white;
    opacity: 0.7;
  }

  .swiper-pagination-bullet-active {
    background: #007aff;
    opacity: 1;
  }
`;

export default function CarouselPro() {
  return (
    <CarouselWrapper>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {slides.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`slide-${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </CarouselWrapper>
  );
}
*/