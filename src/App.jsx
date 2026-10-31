
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// DATA FOTO KENANGAN
// ==========================================

const memories = [
  {
    image: "memories_1.webp",
    caption: "Awal dari banyak cerita",
    number: "01",
  },
  {
    image: "memories_2.webp",
    caption: "Tawa yang selalu dirindukan",
    number: "02",
  },
  {
    image: "memories_3.webp",
    caption: "Enam orang, satu cerita",
    number: "03",
  },
  {
    image: "memories_4.webp",
    caption: "Waktu boleh terus berlalu",
    number: "04",
  },
  {
    image: "memories_5.webp",
    caption: "Namun kebersamaan tetap ada",
    number: "05",
  },
  {
    image: "memories_6.webp",
    caption: "Kenangan yang tak tergantikan",
    number: "06",
  },
];

// ==========================================
// KOMPONEN FOTO
// ==========================================

function Photo({ src, alt, className = "" }) {
  return (
    <div className={`photo-frame ${className}`}>
      <img
        src={`/images/${src}`}
        alt={alt}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div className="photo-placeholder">
        <span>KENANGAN KITA</span>
      </div>
    </div>
  );
}

// ==========================================
// KOMPONEN UTAMA
// ==========================================

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ==========================================
  // ANIMASI REVEAL SAAT SCROLL
  // ==========================================

// ANIMASI REVEAL SAAT SCROLL
useEffect(() => {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  elements.forEach((element) => observer.observe(element));

  return () => observer.disconnect();
}, []);

  // ==========================================
  // CINEMATIC GSAP ANIMATIONS
  // ==========================================

  useEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Animasi normal
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          // 1. HERO PARALLAX

          gsap.fromTo(
            ".hero-image .photo-frame img",
            { scale: 1.12, yPercent: -5 },
            {
              scale: 1,
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
              },
            }
          );

          // 2. HERO TEXT

          gsap.from(".hero-content > *", {
            opacity: 0,
            y: 35,
            duration: 1.1,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.2,
          });

          // 3. INTRODUCTION

          gsap.from(".intro-heading", {
            y: 65,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".introduction",
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });

          // 4. MEMORY CARDS

          gsap.fromTo(
            ".memory-card",
            {
              y: 50,
              autoAlpha: 0,
            },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.18,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".memory-grid",
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // 5. STORY PARALLAX

          gsap.fromTo(
            ".story-image .photo-frame img",
            { scale: 1 },
            {
              scale: 1.18,
              ease: "none",
              scrollTrigger: {
                trigger: ".story",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );

          // 6. FAVORITE PHOTO PARALLAX

          gsap.fromTo(
            ".favorite-main .photo-frame img",
            { scale: 1.12 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".favorite-main",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );

          // 7. CLOSING PARALLAX

          gsap.fromTo(
            ".closing-image .photo-frame img",
            { scale: 1.15 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".closing",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }
      );

      // STORY PIN: DESKTOP ONLY

      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 901px)",
        () => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: ".story",
              start: "top top",
              end: "+=100%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

          timeline
            .fromTo(
              ".story-overlay",
              { opacity: 1 },
              { opacity: 0.55, duration: 1 },
              0
            )
            .fromTo(
              ".story-number",
              { x: 80, opacity: 0 },
              { x: 0, opacity: 1, duration: 1 },
              0
            );
        }
      );
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  // ==========================================
  // TUTUP LIGHTBOX DENGAN TOMBOL ESCAPE
  // ==========================================

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  // ==========================================
  // NAVIGASI SCROLL
  // ==========================================

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMenuOpen(false);
  };

  // ==========================================
  // TAMPILAN WEBSITE
  // ==========================================

  return (
    <main>
      {/* ================================== */}
      {/* NAVIGATION */}
      {/* ================================== */}

      <nav className="navbar">
        <button className="brand" onClick={() => scrollTo("home")}>
          Rendy <span>&</span> Dilla.
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Buka atau tutup menu"
        >
          {menuOpen ? "TUTUP" : "MENU"}
        </button>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <button onClick={() => scrollTo("memories")}>
            Kenangan
          </button>

          <button onClick={() => scrollTo("story")}>
            Perjalanan
          </button>

          <button onClick={() => scrollTo("letter")}>
            Sebuah Surat
          </button>
        </div>
      </nav>

      {/* ================================== */}
      {/* 01 - HERO */}
      {/* ================================== */}

      <section className="hero" id="home">
        <div className="hero-image">
          <Photo src="hero_1.webp" alt="Rendy dan Dilla" />
        </div>

        <div className="hero-overlay" />



    <div className="hero-content">
      <p className="eyebrow light">
        SEBUAH CERITA TENTANG KITA
      </p>

      <h1>
        Banyak Cerita,
        <br />
        Banyak Kenangan,
        <br />
        <em>Hari Ini Tentang</em>
        <br />
        Rendy & Dilla.
      </h1>

      <p className="hero-subtitle">
        Dari perjalanan panjang persahabatan,
        kini kita berkumpul untuk merayakan babak baru kalian.
      </p>
    </div>



        <div className="hero-bottom">
          <span>DIBUAT DENGAN PENUH KASIH</span>
          <span>30 . 10 . 2026</span>
          <span>GULIR UNTUK MENGENANG ↓</span>
        </div>
      </section>

 
    {/* ================================== */}
    {/* 02 - INTRODUCTION */}
    {/* ================================== */}

    <section className="introduction section-padding">
      <div className="intro-decoration">
        ✳
      </div>

      <div className="intro-content">
        <p className="eyebrow">
          SEBUAH CERITA YANG KITA BAGIKAN
        </p>

        <h2 className="intro-heading">
          Berawal dari pertemuan,
          <br />
          tumbuh menjadi <em>persahabatan.</em>git init
        </h2>

        <p className="intro-text reveal">
          Kita dipertemukan melalui PPA. Dari masa sekolah,
          kebersamaan di gereja, hingga berbagai cerita yang
          terus bertambah seiring waktu.

          Tak terasa, kita sudah melewati begitu banyak hal
          bersama. Kini, di tengah perjalanan hidup masing-masing,
          ada satu momen istimewa yang mempertemukan kita kembali:
          merayakan Rendy dan Dilla.
        </p>

        <div className="intro-bottom">
          <span>KENANGAN YANG TERUS BERTUMBUH</span>
          <span>30.10.2026</span>
        </div>
      </div>
    </section>


      {/* ================================== */}
      {/* 03 - MEMORIES */}
      {/* ================================== */}

      <section className="memories section-padding" id="memories">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">
              BABAK 01 — KITA DAN SEGALA CERITA
            </p>

            <h2>
              Nama yang sederhana,
              <br />
              <em>kenangan yang luar biasa.</em>
            </h2>
          </div>

          <p className="heading-note">
            Dua kelompok, enam orang, dan begitu banyak
            kenangan yang tidak mungkin dihitung satu per satu.
          </p>
        </div>

        <div className="memory-grid">
          {memories.map((item, index) => (
            <button
              className={`memory-card memory-card-${index + 1}`}
              key={item.number}
              onClick={() => setLightbox(item)}
              aria-label={`Buka foto ${item.number}`}
            >
              <Photo src={item.image} alt={item.caption} />

              <div className="memory-caption">
                <span>{item.number} / 06</span>
                <p>{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ================================== */}
      {/* 04 - OUR STORY */}
      {/* ================================== */}

      <section className="story" id="story">
        <div className="story-image">
          <Photo
            src="ourStory_1.webp"
            alt="Kenangan perjalanan persahabatan"
          />
        </div>

        <div className="story-overlay" />

        <div className="story-content reveal">
          <p className="eyebrow light">
            BABAK 02 — BERTUMBUH BERSAMA
          </p>

          <h2>
            Dari masa sekolah,
            <br />
            hingga <em>sejauh ini.</em>
          </h2>

          <p>
            Kita telah saling mengenal sejak masa SMP.
            Ada begitu banyak hari yang dilewati bersama,
            mulai dari kebersamaan di gereja, cerita-cerita
            masa sekolah, hingga pertemuan sederhana yang
            selalu berhasil menghadirkan tawa.
            <br />
            <br />
            Waktu terus berjalan. Kita tumbuh, memiliki
            kesibukan, dan menempuh jalan masing-masing.
            Namun, entah bagaimana, selalu ada waktu yang
            kita sisihkan untuk kembali berkumpul.
            <br />
            <br />
            Mungkin itulah arti persahabatan yang sesungguhnya.
            Tidak harus selalu bersama setiap hari, tetapi
            selalu punya tempat untuk kembali.
          </p>

          <span className="story-signature">
            Dengan segala kenangan yang kita punya.
          </span>
        </div>

        <span className="story-number">02</span>
      </section>

      {/* ================================== */}
      {/* 05 - FAVORITE MOMENTS */}
      {/* ================================== */}

      <section className="favorites section-padding">
        <div className="favorites-heading reveal">
          <p className="eyebrow">
            BABAK 03 — HAL-HAL KECIL YANG BERARTI
          </p>

          <h2>
            Bahagia ternyata sesederhana
            <br />
            <em>memiliki kalian.</em>
          </h2>
        </div>

        <div className="favorite-layout">
          <div
            className="favorite-main reveal"
            onClick={() => setLightbox(memories[1])}
          >
            <Photo
              src="favoritMoment_1.webp"
              alt="Salah satu kenangan bersama"
            />

            <span className="photo-index">
              SEBUAH KENANGAN UNTUK SELALU DIINGAT · 01
            </span>
          </div>

          <div className="favorite-side reveal">
            <div
              className="favorite-small"
              onClick={() => setLightbox(memories[3])}
            >
              <Photo
                src="favoritMoment_2.webp"
                alt="Kenangan indah bersama"
              />
            </div>

            <p>
              Tidak semua kenangan harus menjadi peristiwa besar.
              Kadang, yang paling kita ingat justru percakapan
              sederhana, candaan yang tidak ada habisnya,
              saling membantu, atau sekadar meluangkan waktu
              untuk bertemu.
              <br />
              <br />
              Kita mungkin tidak selalu menyadarinya saat itu,
              tetapi hari ini kita tahu: hal-hal kecil itulah
              yang membuat perjalanan ini begitu berharga.
            </p>

            <span className="favorite-ornament">
              Dengan kasih, dari kami.
            </span>
          </div>
        </div>
      </section>

      {/* ================================== */}
      {/* 06 - A LETTER */}
      {/* ================================== */}

      <section className="letter-section" id="letter">
        <div className="letter-inner reveal">
          <p className="eyebrow">
            BABAK 04 — SEBUAH SURAT DARI SAHABAT
          </p>

          <span className="letter-flower">✳</span>

          <h2>
            Ada sesuatu yang ingin kami
            <br />
            <em>sampaikan dari hati.</em>
          </h2>

          <div className="letter-paper">
            <span className="letter-dear">
              Untuk Rendy dan Dilla,
            </span>

            <p>
              Rasanya baru kemarin kita melewati hari-hari
              sederhana bersama. Tertawa, bercanda, saling
              membantu, dan menciptakan begitu banyak cerita
              yang mungkin tidak akan pernah bisa kita ulang
              dengan cara yang sama.
            </p>

            <p>
              Rendy, khusus untukmu, terima kasih sudah menjadi
              sahabat yang luar biasa. Dari masa sekolah hingga
              hari ini, ada begitu banyak hal yang telah kita
              lalui. Terima kasih karena selalu ada, karena
              tidak pernah ragu membantu, dan karena sering
              mengingatkan ketika ada hal yang perlu diperbaiki.
              Nasihat dan kepedulianmu adalah bagian dari
              perjalanan yang akan selalu saya hargai.
            </p>

            <p>
              Hari ini, kami melihatmu memulai perjalanan
              yang berbeda. Bukan lagi hanya tentang dirimu
              sendiri, tetapi tentang kalian berdua, tentang
              membangun rumah, menjaga komitmen, dan belajar
              menjalani kehidupan bersama.
            </p>

            <p>
              Dilla, selamat datang dalam babak baru ini.
              Semoga kalian selalu menjadi tempat pulang satu
              sama lain, saling menguatkan ketika keadaan tidak
              mudah, dan tidak pernah kehilangan alasan untuk
              tertawa bersama.
            </p>

            <p>
              Perjalanan kalian mungkin akan menghadirkan
              banyak hal baru. Akan ada hari yang menyenangkan,
              ada pula hari yang membutuhkan kesabaran.
              Namun, semoga cinta, pengertian, dan Tuhan selalu
              menjadi dasar dalam setiap langkah kalian.
            </p>

            <p>
              Terima kasih sudah menjadi bagian dari cerita
              kami. Dan hari ini, izinkan kami menjadi bagian
              kecil dari cerita indah kalian.
            </p>

            <p>
              <strong>
                Selamat menempuh hidup baru. Berbahagialah
                selalu, Rendy dan Dilla.
              </strong>
            </p>

            <span className="letter-end">
              Dengan penuh kasih,
            </span>

            <span className="letter-signature">
              Sahabat-sahabat kalian ♡
            </span>
          </div>
        </div>
      </section>

      {/* ================================== */}
      {/* 07 - CLOSING */}
      {/* ================================== */}

      <section className="closing">
        <div className="closing-image">
          <Photo
            src="hero_1.webp"
            alt="Rendy dan Dilla di hari istimewa"
          />
        </div>

        <div className="closing-overlay" />

        <div className="closing-content reveal">
          <p className="eyebrow light">
            BABAK 05 — SEBUAH AWAL YANG BARU
          </p>

          <span className="closing-heart">♡</span>

          <h2>
            Semoga cerita kalian
            <br />
            <em>selalu indah.</em>
          </h2>

          <p>
            Hari ini, satu babak indah telah dimulai.
            Semoga perjalanan yang kalian pilih bersama
            dipenuhi kasih, kesetiaan, kesabaran, dan sukacita.
            <br />
            <br />
            Teruslah bertumbuh, saling menjaga, dan berjalan
            bersama dalam setiap musim kehidupan.
            <br />
            <br />
            Dari kami yang pernah tumbuh bersama kalian,
            selamat menempuh hidup baru.
          </p>

          <span className="closing-names">
            RENDY & DILLA
          </span>

          <span className="closing-date">
            SEBUAH CINTA, SEBUAH PERJALANAN, SELAMANYA
          </span>
        </div>
      </section>

      {/* ================================== */}
      {/* FOOTER */}
      {/* ================================== */}

      <footer className="footer">
        <span>DIBUAT DENGAN PENUH KASIH ♡</span>

        <span>SEBUAH CERITA YANG LAYAK DIKENANG</span>

        <button onClick={() => scrollTo("home")}>
          KEMBALI KE ATAS ↑
        </button>
      </footer>

      {/* ================================== */}
      {/* PHOTO LIGHTBOX */}
      {/* ================================== */}

      {lightbox && (
        <div
          className="lightbox"
          onClick={() => setLightbox(null)}
        >
          <button
            className="lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Tutup foto"
          >
            ✕
          </button>

          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <Photo
              src={lightbox.image}
              alt={lightbox.caption}
            />

            <p>{lightbox.caption}</p>
          </div>
        </div>
      )}

      {/* ================================== */}
      {/* BACKGROUND MUSIC */}
      {/* ================================== */}

      <audio
        id="wedding-audio"
        src="/audio/wedding-song.mpeg"
        autoPlay
        loop
        onCanPlay={(event) => {
          event.currentTarget.play().catch((error) => {
            console.log("Autoplay diblokir browser:", error);
          });
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="music-player">
        <button
          className={`music-button ${isPlaying ? "playing" : ""}`}
          onClick={() => {
            const audio = document.getElementById("wedding-audio");

            if (isPlaying) {
              audio.pause();
            } else {
              audio.play().catch((error) => {
                console.error("Musik gagal diputar:", error);
              });
            }
          }}
          aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
        >
          <span className="vinyl">♫</span>
        </button>

        <span className="music-label">
          {isPlaying ? "Sedang Diputar" : "Lagu Untuk Kalian"}
        </span>
      </div>
    </main>
  );
}

export default App;
