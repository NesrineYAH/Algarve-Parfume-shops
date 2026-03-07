import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import styled from "styled-components";

// Images
import slide1 from "../../assets/images/nature.avif";
import slide2 from "../../assets/images/nature2.avif";
import slide3 from "../../assets/images/nautre 3.webp";

const slides = [slide1, slide2, slide3];

const CarouselWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  margin: auto;

  .swiper {
    border-radius: 12px;
    overflow: hidden;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      border-radius: 12px;
      object-fit: cover;
    }
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    background: rgba(0, 0, 0, 0.35);
    padding: 25px;
    border-radius: 50%;
    transition: 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.55);
    }
  }

  .swiper-pagination-bullet {
    background: white;
    opacity: 0.7;

    &-active {
      background: #007aff;
      opacity: 1;
    }
  }
`;

export default function CarouselPro() {
  return (
    <CarouselWrapper>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1}
      >
        {slides.map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} alt={`slide-${i}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </CarouselWrapper>
  );
}


