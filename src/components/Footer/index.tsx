import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import NavLink from "../NavLink";

const Footer = () => {
  const { i18n } = useLingui();

  return (
    <StyleFooter className="flex-shrink-0">
      <div className="container">
        <div className="flex items-center justify-between py-5" style={{ paddingBottom: isMobile ? '2rem' : '3rem' }}>
          <Text>{i18n._(t`© 2021 TokenStand. All rights reserved`)}</Text>
          {
            isMobile ?  <></> : <LogoTK className="logo-token">
              <svg width='72' height='70' viewBox="0 0 72 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.18962 58.4741V59.3158H8.90559C8.87765 59.3176 8.85003 59.3091 8.82801 59.2918C8.80599 59.2746 8.79114 59.2498 8.7863 59.2223C8.7863 59.1925 8.7721 59.1288 8.76216 59.0211H8.03932V61.5462C8.09897 61.5561 8.14867 61.566 8.18133 61.5703C8.21399 61.5745 8.24098 61.5859 8.25518 61.5859C8.26511 61.5852 8.27507 61.5852 8.285 61.5859C8.3222 61.5895 8.35648 61.6075 8.38041 61.6362C8.40433 61.6648 8.41598 61.7017 8.41281 61.7389V62.0223H7.00263V61.7389C6.9994 61.7024 7.01047 61.6661 7.0335 61.6375C7.05654 61.609 7.08976 61.5905 7.12618 61.5859C7.13612 61.5852 7.14608 61.5852 7.15601 61.5859C7.17163 61.5859 7.19577 61.5759 7.22985 61.5703C7.26394 61.5646 7.31364 61.5561 7.37186 61.5462V59.0154H6.64761C6.63766 59.1245 6.62772 59.1925 6.62346 59.2223C6.61992 59.2493 6.60622 59.274 6.58513 59.2914C6.56404 59.3088 6.53714 59.3175 6.50985 59.3158H6.22583V58.4741H9.18962Z" fill="#001C4E" />
                <path d="M15.2932 60.9807C15.2107 61.1946 15.0867 61.3901 14.9282 61.556C14.7676 61.7209 14.5741 61.8503 14.3602 61.9358C14.1263 62.0296 13.8766 62.0777 13.6245 62.0775C13.3711 62.0777 13.12 62.0296 12.8846 61.9358C12.6707 61.8503 12.4772 61.7209 12.3166 61.556C12.1568 61.3903 12.0313 61.1948 11.9474 60.9807C11.858 60.7479 11.8141 60.5002 11.8181 60.251C11.814 60.004 11.8579 59.7586 11.9474 59.5283C12.031 59.3136 12.1565 59.1175 12.3166 58.9516C12.4769 58.7866 12.6705 58.6576 12.8846 58.5732C13.1198 58.4789 13.3711 58.4308 13.6245 58.4315C13.8768 58.4285 14.1271 58.4767 14.3602 58.5732C14.5731 58.6598 14.7664 58.7885 14.9282 58.9516C15.087 59.1177 15.2111 59.3138 15.2932 59.5283C15.3841 59.7583 15.4294 60.0037 15.4267 60.251C15.4293 60.5005 15.384 60.7482 15.2932 60.9807ZM14.6669 59.7295C14.6226 59.5837 14.547 59.4493 14.4454 59.3356C14.3455 59.229 14.2239 59.145 14.0889 59.089C13.9401 59.0295 13.7806 59.001 13.6203 59.0054C13.4586 59.0012 13.2977 59.0296 13.1474 59.089C13.0124 59.1462 12.8913 59.2318 12.7923 59.3398C12.6899 59.4539 12.6125 59.5881 12.5651 59.7338C12.5094 59.9019 12.4825 60.0782 12.4856 60.2552C12.4826 60.4341 12.5094 60.6123 12.5651 60.7823C12.6122 60.9282 12.6896 61.0624 12.7923 61.1763C12.8909 61.2847 13.0121 61.3704 13.1474 61.4271C13.2977 61.4864 13.4586 61.5149 13.6203 61.5107C13.7806 61.5151 13.9401 61.4866 14.0889 61.4271C14.2246 61.3704 14.3463 61.2848 14.4454 61.1763C14.5473 61.0628 14.6229 60.9283 14.6669 60.7823C14.72 60.6117 14.7464 60.4339 14.745 60.2552C14.7467 60.077 14.7204 59.8996 14.6669 59.7295Z" fill="#001C4E" />
                <path d="M21.7036 61.7431V62.0266H20.3219V61.7431C20.3186 61.7067 20.3297 61.6703 20.3527 61.6418C20.3758 61.6133 20.409 61.5947 20.4454 61.5901C20.4586 61.5916 20.472 61.5916 20.4852 61.5901L20.5548 61.5745L19.7993 60.5911C19.7693 60.5525 19.7303 60.5219 19.6856 60.5019C19.6313 60.4794 19.5726 60.4692 19.5138 60.4721H19.3008V61.5504L19.4428 61.5745C19.4783 61.5745 19.5025 61.5901 19.5167 61.5901C19.5266 61.5893 19.5366 61.5893 19.5465 61.5901C19.5829 61.5947 19.6161 61.6133 19.6392 61.6418C19.6622 61.6703 19.6733 61.7067 19.67 61.7431V62.0266H18.2584V61.7431C18.2552 61.7067 18.2663 61.6703 18.2893 61.6418C18.3123 61.6133 18.3456 61.5947 18.382 61.5901C18.3919 61.5917 18.4019 61.5917 18.4118 61.5901C18.436 61.583 18.4607 61.5778 18.4856 61.5745C18.5212 61.5745 18.5751 61.5604 18.6277 61.5504V58.9616C18.568 58.9516 18.5141 58.9375 18.4856 58.9318C18.4572 58.9261 18.4274 58.9219 18.4118 58.9219C18.4019 58.9225 18.3919 58.9225 18.382 58.9219C18.3447 58.9173 18.3108 58.8982 18.2877 58.8687C18.2645 58.8392 18.254 58.8018 18.2584 58.7646V58.4812H19.67V58.7646C19.6744 58.8018 19.6639 58.8392 19.6408 58.8687C19.6176 58.8982 19.5837 58.9173 19.5465 58.9219C19.5366 58.9227 19.5266 58.9227 19.5167 58.9219C19.4924 58.9274 19.4677 58.9307 19.4428 58.9318C19.4087 58.9318 19.3548 58.9516 19.3008 58.9616V59.9662H19.4556C19.508 59.9696 19.5605 59.9608 19.609 59.9407C19.6516 59.9227 19.6888 59.8939 19.7169 59.8571L20.4525 58.9276C20.4426 58.9276 20.4326 58.9276 20.4184 58.9276C20.4085 58.9284 20.3985 58.9284 20.3886 58.9276C20.3522 58.9229 20.319 58.9044 20.2959 58.8759C20.2729 58.8473 20.2618 58.811 20.2651 58.7745V58.4911H21.5858V58.7745C21.589 58.811 21.5779 58.8473 21.5549 58.8759C21.5319 58.9044 21.4986 58.9229 21.4622 58.9276C21.4523 58.9276 21.4438 58.9276 21.4239 58.9276C21.404 58.9276 21.3742 58.9375 21.3344 58.9431C21.2946 58.9488 21.2464 58.9573 21.1924 58.9672L20.3886 59.9591C20.3543 59.9989 20.3178 60.0367 20.2793 60.0725C20.2448 60.1031 20.2066 60.1292 20.1656 60.1504C20.2169 60.1711 20.2647 60.1993 20.3077 60.234C20.3569 60.2753 20.4003 60.323 20.4369 60.3757L21.3145 61.5519C21.3742 61.5618 21.4182 61.5717 21.4565 61.5759C21.4949 61.5802 21.5261 61.5915 21.546 61.5915C21.5659 61.5915 21.5744 61.5915 21.5843 61.5915C21.6197 61.5971 21.6517 61.6159 21.6738 61.644C21.6959 61.6721 21.7066 61.7075 21.7036 61.7431Z" fill="#001C4E" />
                <path d="M27.1868 58.4741V59.4093H26.9028C26.8755 59.411 26.8486 59.4023 26.8275 59.3849C26.8064 59.3676 26.7927 59.3429 26.7891 59.3158C26.7891 59.2761 26.7707 59.1741 26.7551 59.0012H25.6062V59.9861H26.8147V60.4976H25.6062V61.498H26.7551C26.7707 61.3251 26.7849 61.2217 26.7891 61.182C26.793 61.1551 26.8068 61.1306 26.8278 61.1133C26.8488 61.096 26.8755 61.0872 26.9028 61.0885H27.1868V62.0294H24.5681V61.746C24.5648 61.7097 24.5757 61.6736 24.5984 61.6451C24.6212 61.6166 24.654 61.5979 24.6902 61.5929C24.7001 61.5923 24.7101 61.5923 24.72 61.5929C24.7356 61.5929 24.7598 61.583 24.7939 61.5774C24.828 61.5717 24.8833 61.5632 24.9359 61.5533V58.9616C24.8762 58.9517 24.8223 58.9417 24.7939 58.9375C24.7655 58.9332 24.7356 58.9219 24.72 58.9219C24.7101 58.9225 24.7001 58.9225 24.6902 58.9219C24.654 58.9169 24.6212 58.8983 24.5984 58.8698C24.5757 58.8413 24.5648 58.8051 24.5681 58.7689V58.4855H27.1925L27.1868 58.4741Z" fill="#001C4E" />
                <path d="M33.8144 58.4741V58.7575C33.8176 58.794 33.8066 58.8303 33.7835 58.8589C33.7605 58.8874 33.7273 58.9059 33.6908 58.9106C33.6809 58.9112 33.6709 58.9112 33.661 58.9106C33.6454 58.9106 33.6213 58.9205 33.5872 58.9261C33.5531 58.9318 33.5034 58.9403 33.4452 58.9502V62.0223H33.1001C33.0563 62.0231 33.0128 62.0149 32.9723 61.9982C32.9309 61.9773 32.8953 61.9467 32.8686 61.9089L31.0011 59.5525C31.0071 59.6033 31.0105 59.6543 31.0111 59.7055C31.0111 59.7537 31.0111 59.8033 31.0111 59.8472V61.5476L31.3306 61.5915C31.367 61.5961 31.4002 61.6147 31.4233 61.6432C31.4463 61.6717 31.4574 61.7081 31.4542 61.7446V62.028H30.0539V61.7446C30.0507 61.7083 30.0615 61.6721 30.0843 61.6436C30.107 61.6151 30.1399 61.5965 30.176 61.5915C30.1859 61.5931 30.196 61.5931 30.2059 61.5915C30.23 61.5844 30.2547 61.5792 30.2797 61.5759C30.3152 61.5759 30.3692 61.5618 30.4288 61.5518V58.9616C30.3692 58.9517 30.3152 58.9417 30.2797 58.9375C30.2442 58.9332 30.2215 58.9219 30.2059 58.9219C30.1959 58.9225 30.186 58.9225 30.176 58.9219C30.1399 58.9169 30.107 58.8983 30.0843 58.8698C30.0615 58.8413 30.0507 58.8051 30.0539 58.7689V58.4855H30.7739C30.8037 58.4855 30.8279 58.4855 30.8478 58.4855C30.8668 58.4847 30.8856 58.4896 30.9017 58.4996C30.919 58.5051 30.9343 58.5154 30.9457 58.5294C30.9638 58.5479 30.9805 58.5678 30.9955 58.5889L32.87 60.9666C32.87 60.9071 32.8615 60.8533 32.8558 60.7994C32.8501 60.7456 32.8558 60.6903 32.8558 60.6407V58.9616L32.5349 58.9176C32.4984 58.913 32.4652 58.8945 32.4422 58.866C32.4191 58.8374 32.4081 58.8011 32.4113 58.7646V58.4812H33.813L33.8144 58.4741Z" fill="#001C4E" />
                <path d="M38.9765 60.9213C38.9767 61.0744 38.9483 61.2263 38.8927 61.3691C38.8407 61.509 38.7577 61.6354 38.6499 61.7389C38.539 61.8471 38.4064 61.9307 38.2608 61.984C38.0932 62.0462 37.9155 62.0764 37.7368 62.0733H37.6629C37.3146 62.0667 36.9698 62.0036 36.6418 61.8863V60.9709H36.9259C36.9525 60.968 36.9792 60.9756 37.0004 60.992C37.0216 61.0084 37.0356 61.0323 37.0395 61.0587C37.0494 61.1027 37.0636 61.2415 37.0835 61.4683C37.3049 61.5197 37.5323 61.5411 37.7595 61.532C37.9174 61.5413 38.0735 61.4941 38.1997 61.3988C38.2522 61.3502 38.2931 61.2905 38.3194 61.2241C38.3457 61.1576 38.3567 61.0861 38.3517 61.0148C38.3548 60.9325 38.3308 60.8514 38.2835 60.7838C38.2322 60.7234 38.1682 60.675 38.096 60.6421C38.0118 60.6009 37.9244 60.5663 37.8347 60.5387C37.7353 60.5104 37.6317 60.4848 37.5337 60.4508C37.4311 60.4171 37.3306 60.3773 37.2326 60.3318C37.1342 60.2866 37.0439 60.2253 36.9656 60.1504C36.8843 60.0734 36.8217 59.9789 36.7824 59.8741C36.7317 59.7441 36.7066 59.6055 36.7086 59.466C36.7097 59.3335 36.7374 59.2025 36.7901 59.0808C36.8428 58.9591 36.9194 58.8492 37.0153 58.7575C37.1219 58.6601 37.2457 58.5833 37.3803 58.5308C37.539 58.4686 37.7083 58.4383 37.8788 58.4415C38.229 58.4426 38.5758 58.5114 38.8998 58.6442V59.5539H38.6158C38.5885 59.5555 38.5616 59.5468 38.5405 59.5295C38.5194 59.5121 38.5057 59.4874 38.5022 59.4604C38.4923 59.4164 38.4781 59.2832 38.4582 59.0622C38.2722 58.9997 38.0761 58.9728 37.8802 58.9828C37.8001 58.9814 37.7202 58.9914 37.643 59.0126C37.5808 59.0336 37.5226 59.0652 37.4712 59.1061C37.426 59.1459 37.3888 59.194 37.3618 59.2478C37.3379 59.3057 37.3263 59.368 37.3278 59.4306C37.3275 59.506 37.3536 59.5792 37.4016 59.6375C37.4518 59.6973 37.5142 59.7456 37.5848 59.7792C37.67 59.8232 37.7588 59.8597 37.8504 59.8883C37.9498 59.918 38.0478 59.9521 38.1514 59.9861C38.2551 60.0201 38.3545 60.0654 38.4525 60.1093C38.5508 60.1531 38.641 60.213 38.7195 60.2865C38.8 60.3589 38.864 60.4479 38.9069 60.5472C38.9571 60.6654 38.9808 60.793 38.9765 60.9213Z" fill="#001C4E" />
                <path d="M44.755 58.4741V59.3158H44.471C44.443 59.3176 44.4154 59.3091 44.3934 59.2918C44.3714 59.2746 44.3565 59.2498 44.3517 59.2223C44.3517 59.1925 44.3375 59.1288 44.3275 59.0211H43.6019V61.5462C43.6615 61.5561 43.7112 61.566 43.7439 61.5703C43.7765 61.5745 43.8035 61.5859 43.8177 61.5859C43.8276 61.5852 43.8376 61.5852 43.8475 61.5859C43.8847 61.5895 43.919 61.6075 43.9429 61.6362C43.9669 61.6648 43.9785 61.7017 43.9754 61.7389V62.0223H42.5638V61.7389C42.5605 61.7024 42.5716 61.6661 42.5946 61.6375C42.6177 61.609 42.6509 61.5905 42.6873 61.5859C42.6972 61.5852 42.7072 61.5852 42.7171 61.5859C42.7327 61.5859 42.7569 61.5759 42.791 61.5703C42.8251 61.5646 42.8748 61.5561 42.933 61.5462V59.0154H42.2073C42.1974 59.1245 42.1874 59.1925 42.1832 59.2223C42.1796 59.2493 42.1659 59.274 42.1448 59.2914C42.1237 59.3088 42.0968 59.3175 42.0695 59.3158H41.7855V58.4741H44.7507H44.755Z" fill="#001C4E" />
                <path d="M51.0462 61.7814V62.0322H49.8462V61.7814C49.8478 61.7525 49.8581 61.7249 49.8759 61.7021C49.8937 61.6793 49.918 61.6625 49.9456 61.6538C49.9555 61.6538 49.9896 61.6383 50.0436 61.6142L50.0237 61.5603L49.8462 61.0729H48.4261L48.2429 61.5802L48.2287 61.6099C48.2826 61.634 48.3167 61.6439 48.3267 61.6496C48.3543 61.6582 48.3786 61.675 48.3964 61.6978C48.4141 61.7206 48.4245 61.7483 48.4261 61.7771V62.0279H47.2218V61.7814C47.2233 61.7527 47.2334 61.7252 47.2509 61.7024C47.2684 61.6796 47.2924 61.6627 47.3198 61.6538L47.5925 61.5405L48.7953 58.4727H49.477L50.6855 61.5405L50.9567 61.6538C50.9835 61.6625 51.0068 61.6796 51.0229 61.7026C51.0391 61.7256 51.0472 61.7533 51.0462 61.7814ZM48.5936 60.6095H49.6744L49.2654 59.5014C49.2455 59.4476 49.2256 59.388 49.2015 59.32C49.1773 59.252 49.156 59.167 49.1319 59.0834C49.1077 59.167 49.0822 59.2463 49.0623 59.32C49.0433 59.386 49.0206 59.4508 48.9941 59.5142L48.5936 60.6095Z" fill="#001C4E" />
                <path d="M57.6568 58.4741V58.7575C57.6601 58.794 57.649 58.8303 57.626 58.8589C57.6029 58.8874 57.5697 58.9059 57.5333 58.9106C57.5234 58.9112 57.5134 58.9112 57.5035 58.9106C57.4878 58.9106 57.4637 58.9205 57.4296 58.9261C57.3955 58.9318 57.3458 58.9403 57.2876 58.9502V62.0223H56.9468C56.9025 62.0229 56.8586 62.0147 56.8175 61.9982C56.7766 61.9767 56.7412 61.9462 56.7139 61.9089L54.8493 59.5411C54.8553 59.5919 54.8586 59.643 54.8592 59.6942C54.8592 59.7423 54.8592 59.7919 54.8592 59.8359V61.5363L55.1787 61.5802C55.2152 61.5848 55.2484 61.6033 55.2714 61.6319C55.2945 61.6604 55.3055 61.6967 55.3023 61.7332V62.0166H53.9021V61.7332C53.8988 61.6969 53.9097 61.6608 53.9324 61.6323C53.9551 61.6038 53.988 61.5851 54.0242 61.5802C54.0341 61.5817 54.0441 61.5817 54.054 61.5802C54.0782 61.5731 54.1029 61.5679 54.1279 61.5646C54.1634 61.5646 54.2173 61.5504 54.277 61.5405V58.9616C54.2173 58.9517 54.1634 58.9417 54.1279 58.9375C54.0924 58.9332 54.0696 58.9219 54.054 58.9219C54.0441 58.9225 54.0341 58.9225 54.0242 58.9219C53.988 58.9169 53.9551 58.8983 53.9324 58.8698C53.9097 58.8413 53.8988 58.8051 53.9021 58.7689V58.4855H54.6221C54.6519 58.4855 54.676 58.4855 54.6959 58.4855C54.7149 58.4847 54.7337 58.4896 54.7499 58.4996C54.7671 58.5051 54.7824 58.5154 54.7939 58.5294C54.812 58.5479 54.8286 58.5678 54.8436 58.5889L56.7181 60.9666C56.7181 60.9071 56.7082 60.8533 56.7039 60.7994C56.6997 60.7456 56.7039 60.6903 56.7039 60.6407V58.9616L56.383 58.9176C56.3466 58.913 56.3133 58.8945 56.2903 58.866C56.2673 58.8374 56.2562 58.8011 56.2594 58.7646V58.4812H57.6568V58.4741Z" fill="#001C4E" />
                <path d="M63.9848 60.251C63.9877 60.4972 63.9429 60.7416 63.8527 60.9709C63.7698 61.182 63.6457 61.3746 63.4878 61.5377C63.3251 61.6961 63.1318 61.82 62.9197 61.9018C62.6855 61.9933 62.4356 62.0385 62.1841 62.035H60.497V61.7516C60.4938 61.7151 60.5048 61.6788 60.5279 61.6503C60.5509 61.6217 60.5841 61.6032 60.6206 61.5986C60.6305 61.5977 60.6405 61.5977 60.6504 61.5986C60.6646 61.5986 60.6901 61.5887 60.7242 61.583L60.8662 61.5589V58.9615L60.7242 58.9374C60.6901 58.9374 60.6646 58.9219 60.6504 58.9219C60.6405 58.9227 60.6305 58.9227 60.6206 58.9219C60.5841 58.9172 60.5509 58.8987 60.5279 58.8702C60.5048 58.8416 60.4938 58.8053 60.497 58.7688V58.4854H62.1799C62.4314 58.4819 62.6812 58.5271 62.9155 58.6186C63.1289 58.697 63.323 58.8202 63.4847 58.9798C63.6464 59.1394 63.7719 59.3318 63.8527 59.5439C63.9414 59.7691 63.9863 60.0091 63.9848 60.251ZM63.3046 60.251C63.3083 60.0739 63.2814 59.8975 63.2251 59.7296C63.1787 59.5846 63.1033 59.4506 63.0035 59.3356C62.9044 59.2289 62.7832 59.1448 62.6485 59.0891C62.4997 59.0289 62.3404 58.999 62.1799 59.0012H61.538V61.5065H62.1799C62.3404 61.5087 62.4997 61.4788 62.6485 61.4186C62.7832 61.3629 62.9044 61.2788 63.0035 61.1721C63.1044 61.0579 63.1799 60.9236 63.2251 60.7781C63.2814 60.6082 63.3083 60.43 63.3046 60.251Z" fill="#001C4E" />
                <path d="M55.4883 34.334V13.9532L55.1801 13.9036C48.4715 12.8125 40.2007 9.98845 36.8478 6.13704L36.5993 5.85364L36.3153 6.11012C32.8857 9.28704 25.5792 12.0233 17.7032 13.0804L17.3865 13.1229V34.3057C17.3865 34.4204 16.6168 45.7706 25.8263 49.3117C35.2899 53.9028 36.071 54.2854 36.071 54.2868L36.2414 54.369L36.409 54.2797C36.4402 54.2627 37.2923 53.8093 46.7418 49.3202C55.974 45.7692 55.494 34.4332 55.4883 34.334ZM46.4535 48.6528C38.7849 52.2903 36.7541 53.2878 36.2286 53.55C35.7117 53.2978 33.6795 52.3101 26.1217 48.6415C17.3979 45.286 18.1136 34.4714 18.1221 34.3297V13.7591C25.8163 12.6808 32.9553 10.0168 36.5411 6.89372C40.3172 10.9279 48.8961 13.5295 54.7527 14.5725V34.3524C54.7555 34.4615 55.2114 45.2846 46.4535 48.6528Z" fill="#5EA84E" />
                <path d="M54.0227 34.0818V15.553C46.6963 14.4534 39.546 11.5032 36.5169 8.02307C33.066 11.2212 26.275 13.3751 18.95 14.282L18.8577 34.0818C18.8577 34.0818 18.4388 44.3763 26.8302 47.6042C35.5782 51.8553 36.1036 52.1982 36.1036 52.1982C36.1036 52.1982 36.9557 51.8567 45.9252 47.6042C54.3166 44.3763 54.0227 34.0818 54.0227 34.0818ZM36.5779 45.0508C33.6164 45.0511 30.7212 44.175 28.2586 42.5335C25.796 40.8919 23.8766 38.5586 22.743 35.8285C21.6095 33.0985 21.3127 30.0943 21.8903 27.196C22.4679 24.2976 23.8939 21.6353 25.988 19.5456C28.0821 17.4559 30.7501 16.0328 33.6548 15.4562C36.5594 14.8796 39.5702 15.1754 42.3064 16.3062C45.0426 17.437 47.3812 19.352 49.0266 21.8091C50.672 24.2661 51.5503 27.1548 51.5503 30.1099C51.5503 34.0722 49.9729 37.8723 47.1651 40.6742C44.3572 43.4761 40.549 45.0504 36.5779 45.0508Z" fill="#72BF65" />
                <path d="M36.4403 16.6597C33.7738 16.6594 31.1672 17.4481 28.95 18.9261C26.7328 20.4041 25.0046 22.5049 23.9841 24.9629C22.9636 27.4209 22.6965 30.1257 23.2166 32.7352C23.7367 35.3447 25.0207 37.7417 26.9062 39.623C28.7917 41.5043 31.1939 42.7855 33.8091 43.3045C36.4244 43.8235 39.1351 43.557 41.5985 42.5387C44.0619 41.5204 46.1674 39.796 47.6486 37.5837C49.1298 35.3714 49.9203 32.7705 49.92 30.1099C49.917 26.5436 48.4959 23.1242 45.9686 20.6025C43.4413 18.0807 40.0144 16.6627 36.4403 16.6597ZM36.4403 42.8303C33.9189 42.8303 31.4541 42.0843 29.3576 40.6865C27.2612 39.2888 25.6272 37.3021 24.6623 34.9778C23.6974 32.6534 23.4449 30.0958 23.9368 27.6282C24.4287 25.1607 25.6429 22.8941 27.4258 21.1152C29.2087 19.3362 31.4802 18.1247 33.9532 17.6338C36.4261 17.143 38.9894 17.3949 41.3189 18.3577C43.6483 19.3205 45.6394 20.9509 47.0402 23.0428C48.441 25.1346 49.1887 27.594 49.1887 30.1099C49.1849 33.4824 47.8406 36.7157 45.4506 39.1004C43.0606 41.4852 39.8202 42.8266 36.4403 42.8303Z" fill="#5EA84E" />
                <path d="M35.4504 26.7417H35.324V30.1694H35.4504H36.3551V26.7417H35.4504ZM35.4504 26.7417H35.324V30.1694H35.4504H36.3551V26.7417H35.4504ZM30.0242 20.3807V23.6781C30.2678 23.2539 30.6542 22.9296 31.1148 22.7627C31.4263 22.6433 31.7568 22.5814 32.0904 22.5799H35.324V34.6655C35.3207 35.0042 35.2587 35.3398 35.1409 35.6575C35.0495 35.8874 34.9257 36.1031 34.773 36.2979C34.6115 36.4747 34.4266 36.6286 34.2235 36.7556H38.6258C38.4222 36.6287 38.2369 36.4747 38.0748 36.2979C37.9213 36.1019 37.7943 35.8866 37.6971 35.6575C37.5717 35.3422 37.5132 35.0045 37.5252 34.6655V22.5799H40.7574C41.0871 22.5836 41.4136 22.6455 41.7217 22.7627C41.9526 22.8522 42.1689 22.9754 42.3636 23.1283C42.5418 23.2889 42.6963 23.474 42.8223 23.6781V20.3807H30.0242ZM41.7927 21.6801C41.4572 21.5834 41.1095 21.5356 40.7603 21.5384H36.4971V25.1249L36.8138 25.4409L36.6888 25.5641L36.5468 25.7058L36.4914 25.7611V30.9686L36.7214 31.1996L36.8081 31.2846L36.4971 31.6062V34.6882C36.4961 34.8649 36.5113 35.0414 36.5425 35.2153C36.5738 35.3826 36.6121 35.5498 36.6575 35.7184H36.213L36.3053 35.2153C36.3359 35.0413 36.3511 34.8649 36.3508 34.6882V31.6091L36.0824 31.3427L36.0313 31.2902L36.1165 31.2052L36.3508 30.9728V25.7696L36.1548 25.5741L36.0313 25.4508L36.3508 25.1319V21.5483H32.0947C31.7452 21.5478 31.3973 21.5955 31.0609 21.69V21.4166H41.7969L41.7927 21.6801ZM35.4504 26.736H35.324V30.1637H35.4504H36.3551V26.7417L35.4504 26.736Z" fill="#5EA84E" />
                <path d="M33.982 27.2447C34.3593 26.9305 34.8327 26.7541 35.3241 26.7445H35.4504H36.3551V25.7725L36.2968 25.7144H35.4448H35.3184C34.5889 25.7392 33.8862 25.9948 33.3117 26.4441C33.0105 26.6966 32.7645 27.0082 32.5889 27.3595C32.4153 27.7002 32.3248 28.0769 32.3248 28.4591C32.324 28.8373 32.4146 29.2101 32.5889 29.5459C32.7666 29.8926 33.0125 30.2001 33.3117 30.45C33.8728 30.9258 34.5821 31.1923 35.3184 31.2038H36.1165L36.3508 30.9715V30.1822H35.4448H35.3184C34.8269 30.1733 34.3533 29.9968 33.9764 29.682C33.7906 29.5386 33.6403 29.3546 33.5368 29.1442C33.4334 28.9339 33.3796 28.7027 33.3796 28.4683C33.3796 28.234 33.4334 28.0028 33.5368 27.7924C33.6403 27.582 33.7906 27.3981 33.9764 27.2547L33.982 27.2447ZM33.982 27.2447C34.3593 26.9305 34.8327 26.7541 35.3241 26.7445H35.4504H36.3551V25.7725L36.2968 25.7144H35.4448H35.3184C34.5889 25.7392 33.8862 25.9948 33.3117 26.4441C33.0105 26.6966 32.7645 27.0082 32.5889 27.3595C32.4153 27.7002 32.3248 28.0769 32.3248 28.4591C32.324 28.8373 32.4146 29.2101 32.5889 29.5459C32.7666 29.8926 33.0125 30.2001 33.3117 30.45C33.8728 30.9258 34.5821 31.1923 35.3184 31.2038H36.1165L36.3508 30.9715V30.1822H35.4448H35.3184C34.8269 30.1733 34.3533 29.9968 33.9764 29.682C33.7906 29.5386 33.6403 29.3546 33.5368 29.1442C33.4334 28.9339 33.3796 28.7027 33.3796 28.4683C33.3796 28.234 33.4334 28.0028 33.5368 27.7924C33.6403 27.582 33.7906 27.3981 33.9764 27.2547L33.982 27.2447ZM42.3323 33.4484C42.0145 32.776 41.5616 32.176 41.0017 31.6856C40.4478 31.1953 39.8054 30.8149 39.1087 30.5648C38.5988 30.3786 38.0671 30.2581 37.5267 30.2063C37.3108 30.185 37.0935 30.1751 36.872 30.1751H35.4519H35.3255C34.834 30.1662 34.3604 29.9897 33.9835 29.6749C33.7977 29.5315 33.6474 29.3475 33.5439 29.1372C33.4405 28.9268 33.3867 28.6956 33.3867 28.4612C33.3867 28.2269 33.4405 27.9957 33.5439 27.7853C33.6474 27.5749 33.7977 27.391 33.9835 27.2476C34.3607 26.9334 34.8341 26.7569 35.3255 26.7474H35.4519H36.9657C37.1568 26.7462 37.3474 26.7672 37.5338 26.8097C37.7132 26.8502 37.8865 26.914 38.0493 26.9996C38.3542 27.1525 38.6148 27.3808 38.8062 27.6628C38.8651 27.7593 38.897 27.8699 38.8985 27.983C38.8995 28.0719 38.8754 28.1593 38.8289 28.2352C38.7782 28.3238 38.709 28.4004 38.6259 28.4599C38.5428 28.5193 38.4478 28.5601 38.3475 28.5796H41.7657C41.4604 28.503 41.2843 28.3415 41.2388 28.0978C41.1452 27.1473 40.6873 26.2696 39.9607 25.6478C39.2896 25.046 38.4442 24.6724 37.5465 24.5808C37.358 24.5593 37.1683 24.5489 36.9785 24.5496H35.3241C34.2696 24.555 33.2536 24.9457 32.4682 25.6478C32.0572 25.9935 31.7271 26.4249 31.5011 26.9115C31.2752 27.3982 31.1588 27.9284 31.1603 28.4648C31.1603 29.5634 31.5962 30.502 32.4682 31.2804C33.2538 31.982 34.2697 32.3721 35.3241 32.3771H36.872C37.0912 32.377 37.31 32.3936 37.5267 32.4267C38.2464 32.5389 38.9233 32.8402 39.4878 33.2996C39.8197 33.576 40.0893 33.9194 40.2788 34.3071C40.4676 34.6898 40.5657 35.1106 40.5657 35.537C40.5657 35.9635 40.4676 36.3843 40.2788 36.767C40.087 37.1488 39.8176 37.4866 39.4878 37.7589C39.136 38.0505 38.7363 38.2792 38.3063 38.4348C37.8471 38.6034 37.3613 38.6884 36.872 38.6856H36.2528C35.764 38.6884 35.2786 38.6035 34.8199 38.4348C34.3898 38.2795 33.99 38.0508 33.6384 37.7589C33.3086 37.4866 33.0392 37.1488 32.8474 36.767C32.6562 36.3833 32.5589 35.9599 32.5633 35.5314C32.5627 35.4434 32.5665 35.3554 32.5747 35.2678C32.5747 35.1842 32.5932 35.0964 32.6088 35.0057C32.6689 34.8125 32.7944 34.6463 32.9638 34.5352C33.1012 34.4464 33.2523 34.3808 33.4112 34.3411C33.4563 34.3235 33.5048 34.3158 33.5532 34.3184L30.0668 32.8079C30.2538 33.043 30.3867 33.3164 30.4559 33.6085C30.4716 33.7681 30.4792 33.9285 30.4786 34.0889C30.4789 34.2417 30.4713 34.3945 30.4559 34.5466C30.3825 34.8698 30.3439 35.1999 30.3409 35.5314C30.3388 36.2547 30.4958 36.9696 30.801 37.6257C31.1124 38.2987 31.5664 38.8962 32.1316 39.3771C32.6869 39.8678 33.3282 40.2521 34.0232 40.5107C34.7384 40.7782 35.4962 40.9141 36.2599 40.9117H36.8791C37.6428 40.9141 38.4006 40.7782 39.1158 40.5107C39.8112 40.2522 40.453 39.8679 41.0088 39.3771C41.5736 38.8958 42.0275 38.2983 42.3394 37.6257C42.6435 36.9693 42.8001 36.2545 42.7981 35.5314C42.7986 34.8113 42.6395 34.1 42.3323 33.4484ZM41.3922 37.202C41.1425 37.7429 40.7736 38.2205 40.3129 38.5992C39.8541 39.0117 39.3212 39.3338 38.7423 39.5486C38.1444 39.7724 37.5105 39.8852 36.872 39.8816H36.2528C35.6186 39.8832 34.9893 39.7704 34.3953 39.5486C33.8117 39.3356 33.2743 39.0134 32.8119 38.5992C32.3619 38.2134 31.9985 37.7373 31.7454 37.202C31.4956 36.6804 31.3665 36.1095 31.3676 35.5314C31.3652 35.4013 31.3709 35.2711 31.3846 35.1417C31.3979 35.0108 31.4206 34.881 31.4528 34.7534V34.7067C31.4718 34.6556 31.4796 34.6009 31.4755 34.5466L31.636 34.616C31.6372 34.6283 31.6358 34.6407 31.6319 34.6524C31.628 34.6641 31.6216 34.6749 31.6133 34.684V34.7534L31.5906 34.7988C31.5468 35.0406 31.524 35.2857 31.5224 35.5314C31.5188 36.0988 31.6482 36.6593 31.9001 37.168C32.1481 37.6743 32.4953 38.1258 32.9212 38.4957C33.8463 39.2896 35.027 39.7242 36.2471 39.72H36.8663C37.497 39.7247 38.123 39.6122 38.7125 39.3885C39.2619 39.1812 39.7705 38.879 40.2149 38.4957C40.6409 38.1258 40.9881 37.6743 41.236 37.168C41.4845 36.6581 41.6137 36.0984 41.6137 35.5314C41.6137 34.9643 41.4845 34.4047 41.236 33.8947C40.9877 33.3887 40.6406 32.9373 40.2149 32.567C39.7705 32.1838 39.2619 31.8816 38.7125 31.6743C38.3287 31.5272 37.9279 31.4287 37.5196 31.381C37.3023 31.3552 37.0837 31.3425 36.8649 31.3427H36.7527L36.4175 31.6771L36.3494 31.6091L36.081 31.3427H35.4433H35.317C34.9333 31.3329 34.5539 31.2607 34.1936 31.1287C33.8092 30.9863 33.4551 30.7728 33.1498 30.4996C32.8481 30.2497 32.6052 29.9366 32.4385 29.5825C32.2718 29.2283 32.1854 28.8419 32.1854 28.4506C32.1854 28.0593 32.2718 27.6729 32.4385 27.3187C32.6052 26.9646 32.8481 26.6515 33.1498 26.4016C33.7495 25.8763 34.519 25.5845 35.317 25.5798H35.4433H36.1534L36.0299 25.4565L36.3494 25.1377L36.4175 25.0696L36.8038 25.4565L36.6788 25.5798H36.9629C37.153 25.5794 37.3429 25.5931 37.5309 25.6208C38.1722 25.7081 38.7739 25.9805 39.262 26.4045C39.6129 26.7153 39.8808 27.1082 40.0417 27.548H39.8585C39.8151 27.4146 39.7615 27.2848 39.698 27.1597L39.6753 27.137V27.113C39.3975 26.6687 38.9998 26.3117 38.5278 26.0828C38.2149 25.9257 37.8796 25.8177 37.5338 25.7625C37.346 25.732 37.156 25.7169 36.9657 25.7172H36.551L36.4261 25.8433L36.2997 25.7172H35.4476H35.3212C34.5917 25.742 33.889 25.9976 33.3146 26.447C33.0133 26.6995 32.7673 27.011 32.5917 27.3623C32.4181 27.703 32.3276 28.0798 32.3276 28.4619C32.3268 28.8401 32.4174 29.213 32.5917 29.5488C32.7695 29.8955 33.0153 30.2029 33.3146 30.4528C33.8756 30.9287 34.585 31.1951 35.3212 31.2067H36.1193L36.3536 30.9743L36.4218 30.9063L36.4914 30.9757L36.7214 31.2067H36.8635C37.0822 31.2067 37.3008 31.219 37.5181 31.2435C37.9332 31.2893 38.3413 31.3845 38.7338 31.5269C39.3134 31.7354 39.8469 32.0545 40.3044 32.4664C41.2691 33.3053 41.751 34.3274 41.7501 35.5328C41.7536 36.1085 41.6315 36.6781 41.3922 37.202ZM33.982 27.2447C34.3593 26.9305 34.8327 26.7541 35.3241 26.7445H35.4504H36.3551V25.7725L36.2968 25.7144H35.4448H35.3184C34.5889 25.7392 33.8862 25.9948 33.3117 26.4441C33.0105 26.6966 32.7645 27.0082 32.5889 27.3595C32.4153 27.7002 32.3248 28.0769 32.3248 28.4591C32.324 28.8373 32.4146 29.2101 32.5889 29.5459C32.7666 29.8926 33.0125 30.2001 33.3117 30.45C33.8728 30.9258 34.5821 31.1923 35.3184 31.2038H36.1165L36.3508 30.9715V30.1822H35.4448H35.3184C34.8269 30.1733 34.3533 29.9968 33.9764 29.682C33.7906 29.5386 33.6403 29.3546 33.5368 29.1442C33.4334 28.9339 33.3796 28.7027 33.3796 28.4683C33.3796 28.234 33.4334 28.0028 33.5368 27.7924C33.6403 27.582 33.7906 27.3981 33.9764 27.2547L33.982 27.2447Z" fill="#5EA84E" />
              </svg>
            </LogoTK> 
          }
          <div>
            <a className="social-icon inline-block" href="https://twitter.com/tokenstand" target="_blank" rel="noreferrer">
              <svg width="12" height="10" viewBox="0 0 12 10">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.6406 2.75395L5.66578 3.16917L5.2461 3.11833C3.71843 2.92343 2.38383 2.26245 1.25067 1.15236L0.696681 0.601544L0.553988 1.0083C0.251813 1.91502 0.444869 2.87258 1.0744 3.51661C1.41015 3.87252 1.33461 3.92336 0.755438 3.71151C0.553988 3.64372 0.377719 3.59287 0.360931 3.6183C0.302175 3.67761 0.503625 4.44875 0.663106 4.75381C0.881344 5.17752 1.32621 5.59274 1.81305 5.83849L2.22434 6.03339L1.73751 6.04187C1.26746 6.04187 1.25067 6.05034 1.30103 6.22829C1.46891 6.77911 2.13201 7.36381 2.87066 7.61803L3.39108 7.79599L2.93781 8.06716C2.26631 8.45696 1.4773 8.67729 0.688288 8.69424C0.310569 8.70271 0 8.7366 0 8.76203C0 8.84677 1.02404 9.32131 1.61999 9.50774C3.40786 10.0586 5.53148 9.82128 7.1263 8.88066C8.25945 8.21122 9.39261 6.88079 9.92142 5.59274C10.2068 4.90635 10.4922 3.65219 10.4922 3.05054C10.4922 2.66073 10.5174 2.60989 10.9874 2.14382C11.2644 1.87265 11.5246 1.57606 11.575 1.49132C11.6589 1.33031 11.6505 1.33031 11.2224 1.47437C10.509 1.72859 10.4083 1.69469 10.7608 1.31336C11.021 1.04219 11.3316 0.5507 11.3316 0.406642C11.3316 0.381219 11.2057 0.42359 11.063 0.499856C10.9119 0.584596 10.5761 0.711706 10.3243 0.787973L9.87105 0.932031L9.45976 0.652388C9.23313 0.499856 8.91417 0.330375 8.74629 0.279531C8.31821 0.160895 7.6635 0.177843 7.27738 0.313427C6.22816 0.694758 5.56506 1.67774 5.6406 2.75395Z"
                  fill="white"
                />
              </svg>
            </a>
            <a className="social-icon inline-block" href="https://discord.com/invite/ZGQFHfnx" target="_blank" rel="noreferrer">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.179 2.4398C10.363 2.07179 9.48834 1.79979 8.57368 1.64513C8.56553 1.64356 8.5571 1.64457 8.54955 1.64801C8.542 1.65145 8.53571 1.65715 8.53154 1.66433C8.41954 1.86113 8.29474 2.11766 8.20728 2.32033C7.23719 2.17539 6.25096 2.17539 5.28087 2.32033C5.18345 2.09572 5.07359 1.87671 4.95181 1.66433C4.94768 1.65707 4.94143 1.65123 4.93391 1.64761C4.92638 1.64399 4.91793 1.64275 4.90967 1.64406C3.99554 1.79873 3.12087 2.07073 2.30434 2.43926C2.29732 2.44221 2.29136 2.44723 2.28727 2.45366C0.627541 4.89366 0.172607 7.2734 0.396074 9.62326C0.396696 9.62902 0.398482 9.63459 0.401325 9.63963C0.404167 9.64467 0.408006 9.64909 0.412607 9.6526C1.38135 10.3579 2.46185 10.8952 3.60887 11.2419C3.61687 11.2444 3.62542 11.2444 3.63341 11.2419C3.64141 11.2394 3.64847 11.2346 3.65367 11.2281C3.90007 10.8974 4.11981 10.5481 4.30754 10.1811C4.31874 10.1598 4.30807 10.1342 4.28567 10.1257C3.94114 9.99592 3.60732 9.83935 3.28727 9.6574C3.28152 9.65411 3.27668 9.64946 3.27317 9.64384C3.26967 9.63822 3.26761 9.63182 3.26719 9.62521C3.26676 9.6186 3.26799 9.61199 3.27075 9.60598C3.27351 9.59996 3.27772 9.59472 3.28301 9.59073C3.35021 9.54113 3.41741 9.4894 3.48141 9.43766C3.48717 9.43301 3.49411 9.43005 3.50145 9.42911C3.5088 9.42817 3.51626 9.42928 3.52301 9.43233C5.61741 10.3731 7.88568 10.3731 9.95554 9.43233C9.96231 9.4291 9.96985 9.42784 9.9773 9.42869C9.98475 9.42954 9.99181 9.43246 9.99767 9.43713C10.0617 9.4894 10.1283 9.54113 10.1961 9.59073C10.2014 9.59464 10.2057 9.5998 10.2085 9.60577C10.2114 9.61174 10.2127 9.61832 10.2124 9.62492C10.2121 9.63153 10.2101 9.63795 10.2067 9.64362C10.2033 9.64929 10.1986 9.65402 10.1929 9.6574C9.87394 9.84086 9.54221 9.99606 9.19394 10.1251C9.18859 10.1271 9.18372 10.1301 9.17965 10.1341C9.17558 10.1381 9.1724 10.1429 9.17033 10.1482C9.16826 10.1535 9.16735 10.1592 9.16765 10.1648C9.16795 10.1705 9.16946 10.1761 9.17208 10.1811C9.36408 10.5475 9.58381 10.8963 9.82541 11.2275C9.83043 11.2343 9.83743 11.2394 9.84545 11.2421C9.85347 11.2448 9.86211 11.2449 9.87021 11.2425C11.0192 10.8967 12.1015 10.3591 13.0713 9.6526C13.076 9.64929 13.08 9.64501 13.0829 9.64004C13.0859 9.63507 13.0877 9.62954 13.0883 9.6238C13.355 6.907 12.6414 4.54646 11.1955 2.45473C11.192 2.44793 11.1861 2.44263 11.179 2.4398ZM4.62061 8.19233C3.99021 8.19233 3.47021 7.6222 3.47021 6.923C3.47021 6.22326 3.98007 5.65366 4.62061 5.65366C5.26594 5.65366 5.78114 6.22806 5.77101 6.923C5.77101 7.62273 5.26114 8.19233 4.62061 8.19233ZM8.87394 8.19233C8.24301 8.19233 7.72354 7.6222 7.72354 6.923C7.72354 6.22326 8.23288 5.65366 8.87394 5.65366C9.51928 5.65366 10.0345 6.22806 10.0243 6.923C10.0243 7.62273 9.51981 8.19233 8.87394 8.19233Z" 
                  fill="#667795"
                />
              </svg>
            </a>
            <a className="social-icon inline-block" href="#" target="_blank" rel="noreferrer">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd" 
                d="M11.9677 2.46514L10.2777 10.4351C10.1501 10.9975 9.81767 11.1375 9.34527 10.8727L6.77007 8.97514L5.52767 10.1703C5.39007 10.3079 5.27527 10.4227 5.01007 10.4227L5.19527 7.80034L9.96767 3.48794C10.1753 3.30314 9.92247 3.20034 9.64527 3.38554L3.74527 7.10074L1.20528 6.30554C0.652876 6.13314 0.642876 5.75314 1.32048 5.48794L11.2553 1.66034C11.7153 1.48794 12.1177 1.76274 11.9677 2.46554V2.46514Z"
                fill="#667795"
              />
              </svg>
            </a>
            <a className="social-icon inline-block" href="https://github.com/tokenstand/tokenstand-public" target="_blank" rel="noreferrer">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd" 
                  d="M6.3808 0C4.68857 0.000212125 3.06571 0.672541 1.86913 1.86913C0.672541 3.06571 0.000212125 4.68857 0 6.3808C0 9.1984 1.84 11.5864 4.3448 12.448C4.6584 12.4872 4.7752 12.2912 4.7752 12.1344V11.0384C3.0144 11.4304 2.6232 10.1776 2.6232 10.1776C2.3488 9.4336 1.9184 9.2376 1.9184 9.2376C1.3312 8.8464 1.9568 8.8464 1.9568 8.8464C2.5832 8.8856 2.936 9.512 2.936 9.512C3.5232 10.4904 4.4232 10.216 4.776 10.06C4.8144 9.6296 5.0104 9.356 5.1672 9.1992C3.7576 9.0424 2.2704 8.4944 2.2704 6.028C2.2704 5.324 2.5048 4.7752 2.936 4.3056C2.896 4.188 2.6616 3.5232 3.0144 2.6616C3.0144 2.6616 3.5624 2.5048 4.7752 3.3272C5.284 3.1704 5.8328 3.1312 6.3808 3.1312C6.9288 3.1312 7.4768 3.2096 7.9856 3.3272C9.1992 2.5056 9.7472 2.6616 9.7472 2.6616C10.0992 3.5232 9.864 4.188 9.8248 4.3448C10.2559 4.81447 10.4937 5.42968 10.4904 6.0672C10.4904 8.5336 9.0024 9.0424 7.5944 9.1992C7.8288 9.3944 8.0248 9.7856 8.0248 10.3728V12.1344C8.0248 12.2912 8.1416 12.4864 8.4552 12.448C9.72401 12.0198 10.8261 11.2036 11.6058 10.1149C12.3855 9.02616 12.8032 7.71991 12.8 6.3808C12.7608 2.8576 9.904 0 6.3808 0Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </StyleFooter>
  );
};

export default Footer;

const StyleFooter = styled.footer`
background-color: ${({ theme }) => theme.bgFooter};
border-top: 1px solid ${({ theme }) => theme.border1};
width: 100%;
font-weight: 500;
color: ${({ theme }) => theme.text1};
> .container {
  margin: 0 auto;
  padding: 0 15px;
}
.border-top {
  border-top: 1px solid ${({ theme }) => theme.border1};
  font-size: 14px;
}
.menu-footer {
  font-size: 16px;
  text-align: center;
  li {
    display: inline-block;
    margin: 0 16px;
  }
  a {
    color: ${({ theme }) => theme.text1};
  }
  a:hover {
    opacity: 0.8;
  }
  @media (max-width: 1199px) {
    font-size: 14px;
    li {
      margin: 0 10px 10px;
    }
  }
  
 
}
@media (max-width: 1024px){
  margin-bottom: 50px;
}
.mt-40 {
  margin-top: 40px;
}
.mb-35 {
  margin-bottom: 35px;
}
.social-icon {
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.bg3};
  border-radius: 50%;
  margin-left: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  path {
    fill: ${({ theme }) => theme.text1};
  }
  @media (max-width:640px){
    width: 20px;
    height: 20px;
  }
}
`;

const Text = styled.span`
color: ${({ theme }) => theme.text1}
font-weight: 500;
font-size: 14px;
@media (max-width: 640px){
  font-size: 12px;
}
`;

const TextBold = styled.span`
color: ${({ theme }) => theme.text1};
font-weight: bold;
font-size: 18px;
padding-left: 10px;
`
const StyleLogo = styled.div`
@media (max-width: 640px){
  display: none;
}
`

const LogoTK = styled.div`
svg{
 path:nth-child(-n+10) {
  fill: ${({ theme }) => theme.colorLogo};
 }
}   
`
