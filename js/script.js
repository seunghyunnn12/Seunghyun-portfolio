$(document).ready(function () {
    gsap.registerPlugin(ScrollTrigger); // ScrollTrigger 등록

    let isAnimating = false;

    $('.fixedMenu li').on('click', function (e) {
        e.preventDefault();
        if (isAnimating) return; // 스크롤 중엔 클릭 무시
        let index = $(this).index(); // li 인덱스 가져옴
        let targetSection = $('section').eq(index + 1); // +1 (hero가 0번)

        if (targetSection.length) {
            isAnimating = true;

            // 클릭한 메뉴에 바로 on 붙이기
            $('.fixedMenu li').removeClass('on');
            $(this).addClass('on');

            $('html, body').stop().animate({
                scrollTop: targetSection.offset().top
            }, 600, function () {
                isAnimating = false;
            });
        }

        gsap.fromTo($(this),
            { scale: 1 },
            { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' }
        );
    });

    $(window).on('scroll', function () {
        if (isAnimating) return; // 스크롤 중이면 무시

        let scrollPosition = $(window).scrollTop();

        let found = false;
        $('section').each(function (index) {
            let sectionTop = $(this).offset().top - 100; // 위에 100 여유 주기
            let sectionBottom = sectionTop + $(this).outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                if (index > 0) { // 0번째(hero)는 무시
                    $('.fixedMenu li').removeClass('on').eq(index - 1).addClass('on');
                } else {
                    $('.fixedMenu li').removeClass('on'); // hero 구간일 때 메뉴 on 없음
                }
                found = true;
                return false; // forEach 중지
            }
        });

        if (!found) {
            $('.fixedMenu li').removeClass('on'); // 어디에도 해당 안 되면 전체 off
        }
    });


    const cursor = $('.cursor');
    const follower = $('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;

    $(document).mousemove(function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.set(cursor, { x: mouseX, y: mouseY })
    });

    gsap.ticker.add(() => {
        posX += (mouseX - posX) / 7;
        posY += (mouseY - posY) / 7;
        gsap.set(follower, { x: posX, y: posY }); // <- gsap.to → gsap.set
    });

    $('a, button').on({
        mouseenter: function () {
            gsap.to(follower, {
                scale: 2,
                duration: 0.1
            });
        },
        mouseleave: function () {
            gsap.to(follower, {
                scale: 1,
                duration: 0.1
            });
        }
    });
});

// Hero 섹션 애니메이션
const header = document.querySelector('header');
const words = document.querySelectorAll('.hero .tit-wrap h2 span');
const quote = document.querySelectorAll('.hero .quote span'); // .hero 추가
const heroFlower = document.querySelector('.hero-flower img');

// Hero Flower 애니메이션
const flowerTimeline = gsap.timeline();
flowerTimeline
    .from(heroFlower, {
        y: -500,
        opacity: 0,
        duration: 2,
        ease: 'power2.out'
    })
    .to(heroFlower, {
        rotation: 360,
        duration: 150,
        repeat: -1,
        ease: 'linear'
    });

// Hero Words & Quote 애니메이션 (순차 실행)
const heroTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.hero',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'restart none none none'
    }
});

heroTimeline
    .from(words, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power2.out'
    })
    .from(quote, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power2.out'
    }, "+=0.1");

// About Me (s0) 애니메이션 (한 번만 재생)
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: '.s0',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
        once: true
    }
});

tl.to('.s0 .pf-con h3', {
    opacity: 1,
    x: -10,
    stagger: 0.2
})
    .to('.s0 .pf-con dl > *', {
        opacity: 1,
        x: -10,
        stagger: 0.2
    })
    .from('.s0 .icon-wrap .icon', { // 👈 아이콘만 등장 애니메이션 추가!
        y: 40,              // 아래에서 위로 올라오게
        opacity: 0,         // 투명도 0 → 1
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15       // 순차적으로 하나씩
    })


let mm = gsap.matchMedia();

mm.add("(max-width: 1104px)", () => {
    // 1104px 이하일 때
    tl.to('.s0 .pf-con h3', {
        opacity: 1,
        x: 10,   // 여기선 x를 +10으로
        stagger: 0.2
    });
});

mm.add("(min-width: 1105px)", () => {
    // 1105px 이상일 때
    tl.to('.s0 .pf-con h3', {
        opacity: 1,
        x: -10,  // 기본값
        stagger: 0.2
    });
});


// Header 스크롤 이벤트
window.addEventListener('scroll', function () {
    let i = window.scrollY || document.documentElement.scrollTop;
    if (i >= 100) {
        header.classList.add('scroll');
    } else {
        header.classList.remove('scroll');
    }
});

// Fixed Top 버튼
const fixedTopBtn = document.querySelector('.fixedTop');
window.addEventListener('scroll', () => {
    let scroll = window.scrollY;
    if (scroll > 100) {
        fixedTopBtn.classList.add('On');
    } else {
        fixedTopBtn.classList.remove('On');
    }
});

fixedTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// li 클릭
const projectList = document.querySelectorAll('.project-lst > li');

projectList.forEach((project) => {
    project.addEventListener('click', (e) => {
        // a 태그 클릭이면 아무 것도 안 함
        if (e.target.closest('a')) {
            return;
        }

        e.preventDefault();

        // 현재 열려 있는 항목 닫기
        document.querySelectorAll('.project-lst > li.Click').forEach((item) => {
            if (item !== project) {
                item.classList.remove('Click');
            }
        });

        // 클릭한 항목 toggle (열거나 닫기)
        project.classList.toggle('Click');
    });
});

// 
projectList.forEach((project) => {
    const content = project.querySelector('.content');


});

AOS.init({
    easing: 'ease',
    duration: 1000,
});


// 모바일 메뉴 토글
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const fixedMenu = document.getElementById('fixedMenu');

    if (menuToggle && fixedMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            fixedMenu.classList.toggle('active');
        });

        // 메뉴 바깥 누르면 닫히게 하기 (선택사항)
        document.addEventListener('click', (e) => {
            if (!fixedMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                fixedMenu.classList.remove('active');
            }
        });
    }
});



// 공룡게임

const canvas = document.getElementById("dinoGameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

let dino = {
    x: 50,
    y: 178,
    width: 35,
    height: 35,
    vy: 0,
    gravity: 1,
    jumping: false
};

function createRandomCactus() {
    return {
        x: canvas.width,
        width: 15 + Math.random() * 20,
        height: 30 + Math.random() * 30
    };
}

function createRandomBird() {
    return {
        x: canvas.width,
        width: 30,
        height: 20,
        y: canvas.height - 90  // 이전보다 아래로 내려서 충돌 가능하게 설정
    };
}

let cactus = createRandomCactus();
let bird = null;
let speed = 4;
let score = 0;
let running = false;
let animationId;
let gameOver = false;
const dinoImg = new Image();
dinoImg.src = "./img/dino.png";

const cactusImg = new Image();
cactusImg.src = "./img/tree.png";  // 실제 경로에 맞게 수정

const birdImg = new Image();
birdImg.src = "./img/bird.png";


function drawDino() {
    if (dinoImg.complete) {
        ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    }
}

function drawCactus() {
    if (cactus) {
        if (cactusImg.complete) {
            ctx.drawImage(cactusImg, cactus.x, canvas.height - cactus.height, cactus.width, cactus.height);
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(cactus.x, canvas.height - cactus.height, cactus.width, cactus.height);
        }
    }
}

function drawBird() {
    if (bird) {
        if (birdImg.complete) {
            ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
        }
    }
}


function drawScore() {
    ctx.fillStyle = "#ccc";
    ctx.font = "bold 1.2rem Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 2rem Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "bold 1.5rem Arial";  // 폰트 크기 조금 다르게
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 20);

    ctx.textAlign = "start"; // 다시 초기화
}


function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 중력 적용
    if (dino.jumping || dino.y < canvas.height - dino.height) {
        dino.vy += dino.gravity;
        dino.y += dino.vy;
        if (dino.y >= canvas.height - dino.height) {
            dino.y = canvas.height - dino.height;
            dino.jumping = false;
            dino.vy = 0;
        }
    }

    // 점수 5 이상이면 색 반전
    if (score >= 3) {
        canvas.style.filter = "invert(1)";
    } else {
        canvas.style.filter = "invert(0)";
    }



    // 장애물 이동
    if (cactus) {
        cactus.x -= speed;
        if (cactus.x < -cactus.width) {
            score++;
            speed += 0.5;
            cactus = null;

            // 30% 확률로 새 등장
            if (Math.random() < 0.3) {
                bird = createRandomBird();
            } else {
                cactus = createRandomCactus();
            }
        }
    }

    if (bird) {
        bird.x -= speed;
        if (bird.x < -bird.width) {
            bird = null;
            cactus = createRandomCactus();
            score++;
            speed += 0.2;
        }
    }

    // 충돌 감지
    if (
        cactus &&
        dino.x < cactus.x + cactus.width &&
        dino.x + dino.width > cactus.x &&
        dino.y + dino.height > canvas.height - cactus.height
    ) {
        gameOver = true;
    }

    if (
        bird &&
        dino.x < bird.x + bird.width &&
        dino.x + dino.width > bird.x &&
        dino.y < bird.y + bird.height &&
        dino.y + dino.height > bird.y
    ) {
        gameOver = true;
    }

    if (gameOver) {
        running = false;
        cancelAnimationFrame(animationId);
        drawDino();
        drawCactus();
        drawBird();
        drawScore();
        drawGameOver();
        showRestartButton();
        return;
    }

    drawDino();
    drawCactus();
    drawBird();
    drawScore();

    animationId = requestAnimationFrame(updateGame);
}

function startGame() {
    if (!running && !gameOver) {
        running = true;
        animationId = requestAnimationFrame(updateGame);
    }
}

function pauseGame() {
    if (running) {
        running = false;
        cancelAnimationFrame(animationId);
    }
}

function resetGame() {
    cactus = createRandomCactus();
    bird = null;
    speed = 4;
    dino.y = canvas.height - dino.height;
    dino.vy = 0;
    dino.jumping = false;
    score = 0;
    gameOver = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hideRestartButton();
}

function showRestartButton() {
    restartBtn.style.display = "block";
}

function hideRestartButton() {
    restartBtn.style.display = "none";
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !dino.jumping && running) {
        dino.jumping = true;
        dino.vy = -15;
    }
});

startBtn.addEventListener("click", () => {
    if (gameOver) {
        resetGame();
    }
    startGame();
});

pauseBtn.addEventListener("click", pauseGame);

restartBtn.addEventListener("click", () => {
    resetGame();
    startGame();
});

window.addEventListener("keydown", function (e) {
    if (e.code === "Space" && e.target === document.body) {
        e.preventDefault(); // 기본 스페이스 스크롤 방지
    }
});

document.querySelectorAll('.list-wrap .flex').forEach((el) => {
    el.addEventListener('click', function () {
        const parent = el.closest('.list-wrap');
        const isOpening = !parent.classList.contains('active');

        // 다른 항목 닫기
        document.querySelectorAll('.list-wrap.active').forEach((item) => {
            if (item !== parent) item.classList.remove('active');
        });

        parent.classList.toggle('active');

        if (isOpening) {
            currentOpened = parent;

            const transitionTime = 300;

            setTimeout(() => {
                requestAnimationFrame(() => {
                    const rect = parent.getBoundingClientRect();
                    const scrollY = window.pageYOffset;
                    const viewportHeight = window.innerHeight;

                    // 목표 위치 = 현재 스크롤 위치 + 요소의 top 위치 - (화면 높이 / 2) + (요소 높이 / 2)
                    const targetY = scrollY + rect.top - (viewportHeight / 2) + (rect.height / 2);

                    window.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });
                });
            }, transitionTime);
        }
    });
});


