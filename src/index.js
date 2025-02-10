import "./styles/index.css";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

const windowInnerWidth = document.documentElement.clientWidth;
const scrollbarWidth = parseInt(window.innerWidth) - parseInt(windowInnerWidth);

const bodyElementHTML = document.getElementsByTagName("body")[0];
const modalBackground = document.getElementsByClassName("modalBackground")[0];
const modalClose = document.getElementsByClassName("modalClose")[0];

const roadButton = document.querySelector(".road-button");
const acceptButton = document.querySelector(".accept-button");

const flowerImages = document.querySelectorAll(".flower-image");
const flowerImages2 = document.querySelectorAll(".flower-image2");

const checkboxGroup = document.querySelectorAll('input[name="preferences"]');
const guestForm = document.querySelector(".guest-form");

function bodyMargin() {
  bodyElementHTML.style.marginRight = "-" + scrollbarWidth + "px";
}

const handleModalClose = () => {
  modalBackground.style.display = "none";
  bodyElementHTML.style.overflowY = "scroll";
  if (windowInnerWidth >= 1366) {
    bodyMargin();
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyDOBk64uMmcVonUcUUP2aSKDfiSsWMLE2s",
  authDomain: "our-wedding-invite.firebaseapp.com",
  projectId: "our-wedding-invite",
  storageBucket: "our-wedding-invite.firebasestorage.app",
  messagingSenderId: "394008514443",
  appId: "1:394008514443:web:9c1932b5f6c2dc0264e98e",
};

initializeApp(firebaseConfig);

const db = getFirestore();
const colRef = collection(db, "guests");
getDocs(colRef).then((snapshot) => {
  let guests = [];
  snapshot.docs.forEach((doc) => {
    guests.push({ ...doc.data(), id: doc.id });
  });
  console.log("guests", guests);
});

guestForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    Name: guestForm.guestName.value,
    Attendance: guestForm.attendance.value,
    СompanionName: guestForm.companionName.value,
  };
  const preferences = [];
  for (let preference of guestForm.preferences) {
    if (preference.checked) preferences.push(preference.value);
  }
  if (!preferences.length) {
    preferences.push("Ничего не выбрал");
  }
  data.Preferences = preferences;
  addDoc(colRef, data).then(() => {
    handleModalClose();
    guestForm.reset();
  });
  handleModalClose();
});

const goToMap = () => {
  window.open(
    "https://2gis.ru/directions/tab/taxi/points/|104.257748,52.380613;1548748027142301"
  );
};

roadButton.addEventListener("click", goToMap);

const currentDate = new Date();

const currentTimeZoneOffsetInHours = currentDate.getTimezoneOffset() / 60;
const dateLocationOffset = -8;

const targetDate = new Date(
  `2025-08-25T1${4 - (currentTimeZoneOffsetInHours - dateLocationOffset)}:30:00`
);

function plural(word, num) {
  var forms = word.split("_");
  return num % 10 === 1 && num % 100 !== 11
    ? forms[0]
    : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
    ? forms[1]
    : forms[2];
}

function updateCountdown() {
  const now = new Date();
  const remainingTime = targetDate - now;

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days.toString().padStart(2, "0");
  document.getElementById("days-label").innerText = plural(
    "день_дня_дней",
    days
  );

  document.getElementById("hours").innerText = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("hours-label").innerText = plural(
    "час_часа_часов",
    hours
  );

  document.getElementById("minutes").innerText = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes-label").innerText = plural(
    "минута_минуты_минут",
    minutes
  );

  document.getElementById("seconds").innerText = seconds
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds-label").innerText = plural(
    "секунда_секунды_секунд",
    seconds
  );
}

setInterval(updateCountdown, 1000);

let slider = document.querySelector(".slider"),
  sliderList = slider.querySelector(".slider-list"),
  wishCount = document.getElementById("wish-count"),
  sliderTrack = slider.querySelector(".slider-track"),
  slides = slider.querySelectorAll(".slide"),
  arrows = slider.querySelector(".slider-arrows"),
  prev = arrows.children[0],
  next = arrows.children[2],
  slideWidth = slides[0].offsetWidth,
  slideIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = (slides.length - 1) * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.35,
  trfRegExp = /([-0-9.]+(?=px))/,
  swipeStartTime,
  swipeEndTime,
  getEvent = function (event) {
    return event.type.search("touch") !== -1 ? event.touches[0] : event;
  },
  slide = function () {
    if (transition) {
      sliderTrack.style.transition = "transform .5s";
    }
    sliderTrack.style.transform = `translate3d(-${
      slideIndex * slideWidth
    }px, 0px, 0px)`;

    prev.classList.toggle("disabled", slideIndex === 0);
    next.classList.toggle("disabled", slideIndex === slides.length - 1);

    wishCount.innerText = `${slideIndex + 1}/${slides.length}`;
  },
  swipeStart = function (e) {
    let evt = getEvent(e);

    if (allowSwipe) {
      swipeStartTime = Date.now();

      transition = true;

      nextTrf = (slideIndex + 1) * -slideWidth;
      prevTrf = (slideIndex - 1) * -slideWidth;

      posInit = posX1 = evt.clientX;
      posY1 = evt.clientY;

      sliderTrack.style.transition = "";

      document.addEventListener("touchmove", swipeAction);
      document.addEventListener("mousemove", swipeAction);
      document.addEventListener("touchend", swipeEnd);
      document.addEventListener("mouseup", swipeEnd);

      sliderList.classList.remove("grab");
      sliderList.classList.add("grabbing");
    }
  },
  swipeAction = function (e) {
    let evt = getEvent(e),
      style = sliderTrack.style.transform,
      transform = +style.match(trfRegExp)[0];

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 7 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else if (posY < 7) {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      if (slideIndex === 0) {
        if (posInit < posX1) {
          setTransform(transform, 0);
          return;
        } else {
          allowSwipe = true;
        }
      }

      if (slideIndex === slides.length - 1) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      if (
        (posInit > posX1 && transform < nextTrf) ||
        (posInit < posX1 && transform > prevTrf)
      ) {
        reachEdge();
        return;
      }

      sliderTrack.style.transform = `translate3d(${
        transform - posX2
      }px, 0px, 0px)`;
    }
  },
  swipeEnd = function () {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener("touchmove", swipeAction);
    document.removeEventListener("mousemove", swipeAction);
    document.removeEventListener("touchend", swipeEnd);
    document.removeEventListener("mouseup", swipeEnd);

    sliderList.classList.add("grab");
    sliderList.classList.remove("grabbing");

    if (allowSwipe) {
      swipeEndTime = Date.now();
      if (
        Math.abs(posFinal) > posThreshold ||
        swipeEndTime - swipeStartTime < 300
      ) {
        if (posInit < posX1) {
          slideIndex--;
        } else if (posInit > posX1) {
          slideIndex++;
        }
      }

      if (posInit !== posX1) {
        allowSwipe = false;
        slide();
      } else {
        allowSwipe = true;
      }
    } else {
      allowSwipe = true;
    }
  },
  setTransform = function (transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipe = false;
  },
  reachEdge = function () {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  };

sliderTrack.style.transform = "translate3d(0px, 0px, 0px)";
sliderList.classList.add("grab");

sliderTrack.addEventListener("transitionend", () => (allowSwipe = true));
slider.addEventListener("touchstart", swipeStart);
slider.addEventListener("mousedown", swipeStart);

arrows.addEventListener("click", function (event) {
  let target = event.target;

  if (target.classList.contains("next")) {
    slideIndex++;
  } else if (target.classList.contains("prev")) {
    slideIndex--;
  } else {
    return;
  }
  slide();
});

const getWidthMultiply = (index) => {
  return index && index === "1"
    ? window.screen.width < 390 && window.screen.height < 760
      ? 4.6
      : 3.5
    : 3.5;
};

for (let index in Array.from(flowerImages)) {
  flowerImages[index].width = window.screen.height / getWidthMultiply(index);
}

for (let index in Array.from(flowerImages2)) {
  flowerImages2[index].width =
    window.screen.height /
    (index === "1"
      ? window.screen.height < 700 || window.screen.width < 390
        ? 4
        : 3
      : 3);
}

bodyMargin();

acceptButton.addEventListener("click", function () {
  modalBackground.style.display = "block";
  bodyElementHTML.style.overflowY = "hidden";
  if (windowInnerWidth >= 1366) {
    bodyMargin();
  }
});

modalClose.addEventListener("click", handleModalClose);

modalBackground.addEventListener("click", function (event) {
  if (event.target === modalBackground) {
    handleModalClose();
  }
});
