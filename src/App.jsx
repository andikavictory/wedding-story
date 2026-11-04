
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// DATA FOTO KENANGAN PERSAHABATAN
// ==========================================

const memories = [
  { image: "memory_01.webp", caption: "Awal dari banyak cerita"},
  { image: "memory_02.webp", caption: "Tawa yang selalu dirindukan" },
  { image: "memory_03.webp", caption: "Tidak harus selalu lengkap" },
  { image: "memory_04.webp", caption: "Momen sederhana, cerita luar biasa" },
  { image: "memory_05.webp", caption: "Tempat kita berbagi cerita" },
  { image: "memory_06.webp", caption: "Candaan yang tidak ada habisnya" },
  { image: "memory_07.webp", caption: "Waktu yang selalu berharga" },
  { image: "memory_08.webp", caption: "Satu lingkar, banyak cerita" },
  { image: "memory_09.webp", caption: "Pertemuan yang selalu dirindukan" },
  { image: "memory_10.webp", caption: "Kenangan yang tidak tergantikan" },
  { image: "memory_11.webp", caption: "Tumbuh bersama sepanjang waktu" },
  { image: "memory_12.webp", caption: "Selalu ada alasan untuk berkumpul" },
  { image: "memory_13.webp", caption: "Cerita yang terus bertambah" },
  { image: "memory_14.webp", caption: "Gondal Gandul & Kembar Suram" },
  { image: "memory_15.webp", caption: "Bagian dari perjalanan kita" },
];

// ==========================================
// DATA FOTO RENDY & DILLA
// ==========================================

const couplePhotos = [
  { image: "couple_01.webp", caption: "Sebuah cerita tentang kalian" },
  { image: "couple_02.webp", caption: "Dua hati dalam satu perjalanan" },
  { image: "couple_03.webp", caption: "Momen yang layak dikenang" },
  { image: "couple_04.webp", caption: "Melangkah bersama" },
  { image: "couple_05.webp", caption: "Saling melengkapi" },
  { image: "couple_06.webp", caption: "Cerita yang terus bertumbuh" },
  { image: "couple_07.webp", caption: "Dalam setiap perjalanan" },
  { image: "couple_08.webp", caption: "Hari-hari yang berarti" },
  { image: "couple_09.webp", caption: "Menuju babak yang baru" },
  { image: "couple_10.webp", caption: "Untuk selamanya" },
];

// ==========================================
// KOMPONEN FOTO
// ==========================================

function Photo({ src, alt, className = "", onClick }) {
  return (
    <div
      className={`photo-frame ${className}`}
      onClick={onClick}
    >
      <img
        src={src}
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
  const [hasOpened, setHasOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [letterOpened, setLetterOpened] = useState(false);

  
  // ==========================================
  // LOADING SCREEN
  // ==========================================

  useEffect(() => {
    let timer;

    const hideLoader = () => {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 900);
    };

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader);
    }

    return () => {
      window.removeEventListener("load", hideLoader);
      clearTimeout(timer);
    };
  }, []);


  // ==========================================
  // MEMUTAR MUSIK SAAT ALBUM DIBUKA
  // ==========================================

  const openExperience = () => {
    const audio = document.getElementById("wedding-audio");

    if (audio) {
      audio.volume = 0.65;

      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.log("Musik belum dapat diputar:", error);
        });
    }

    setHasOpened(true);
  };

  // ==========================================
// PROGRESS BAR PERJALANAN ALBUM
// ==========================================

useEffect(() => {
  const updateProgress = () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) {
      setScrollProgress(0);
      return;
    }

    const progress =
      (window.scrollY / scrollableHeight) * 100;

    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  window.addEventListener("scroll", updateProgress, {
    passive: true,
  });

  window.addEventListener("resize", updateProgress);
  updateProgress();

  return () => {
    window.removeEventListener("scroll", updateProgress);
    window.removeEventListener("resize", updateProgress);
  };
}, []);

  // ==========================================
  // ANIMASI REVEAL
  // ==========================================

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
  // ANIMASI GSAP
  // ==========================================


  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {

                    // ==================================
          // HERO & CLOSING PARALLAX
          // ==================================

          gsap.utils.toArray([
            ".hero-image img",
            ".closing-image img"
          ]).forEach((image) => {
            const section = image.closest(".hero, .closing");

            gsap.fromTo(
              image,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              }
            );
          });

          // ==================================
          // MEMORY GALLERY
          // ==================================

          gsap.from(".memory-tile", {
            opacity: 0,
            y: 55,
            scale: 0.97,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".memory-gallery-grid",
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });

          // ==================================
          // COUPLE GALLERY
          // ==================================

          gsap.from(".couple-photo", {
            opacity: 0,
            y: 25,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".couple-gallery-grid",
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });

          

        }
      );

      return () => mm.revert();
    });

    return () => ctx.revert();
  }, []);


  // ==========================================
  // TUTUP LIGHTBOX DENGAN ESCAPE
  // ==========================================

useEffect(() => {
  const handleKeyDown = (event) => {
    if (!lightbox) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      changePhoto(1);
    }

    if (event.key === "ArrowLeft") {
      changePhoto(-1);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [lightbox]);

  // ==========================================
  // NAVIGASI
  // ==========================================

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMenuOpen(false);
  };

  // ==========================================
  // LIGHTBOX
  // ==========================================

const openPhoto = (index, type) => {
  setLightbox({ index, type });
};

const closeLightbox = () => {
  setLightbox(null);
};

const changePhoto = (direction) => {
  if (!lightbox) return;

  const photos =
    lightbox.type === "memory" ? memories : couplePhotos;

  const nextIndex =
    (lightbox.index + direction + photos.length) % photos.length;

  setLightbox({
    ...lightbox,
    index: nextIndex,
  });
};



// LOCK SCROLL WHEN LIGHTBOX IS OPEN
useEffect(() => {
  if (!lightbox) return;

  // Simpan kondisi overflow sebelumnya
  const previousBodyOverflow = document.body.style.overflow;
  const previousHtmlOverflow = document.documentElement.style.overflow;

  // Kunci scroll halaman
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  return () => {
    // Kembalikan kondisi sebelumnya
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousHtmlOverflow;
  };
}, [Boolean(lightbox)]);

return (
  <main>
          {/* ================================== */}
          {/* LOADING SCREEN */}
          {/* ================================== */}

          <div className={`loading-screen ${isLoading ? "" : "loading-hidden"}`}>
            <div className="loading-content">
              <span className="loading-ornament">✳</span>

              <p className="loading-eyebrow">
                A STORY OF LOVE & FRIENDSHIP
              </p>

              <h1>
                Rendy <em>&</em> Dilla.
              </h1>

              <div className="loading-line">
                <div className="loading-line-progress" />
              </div>

              <span className="loading-caption">
                MENYIAPKAN ALBUM KENANGAN
              </span>
            </div>
          </div>

    <div className="album-progress">
      <div
        className="album-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>

      {/* ================================== */}
      {/* 01 - OPENING */}
      {/* ================================== */}

      <div
        className={`opening-screen ${
          hasOpened ? "opening-screen-hidden" : ""
        }`}
      >
        <div className="opening-content">
          <span className="opening-eyebrow">
            A CELEBRATION OF LOVE & FRIENDSHIP
          </span>

          <div className="opening-ornament">✳</div>

          <h1>
            Untuk Rendy
            <br />
            <em>& Dilla.</em>
          </h1>

          <p>
            Dari sahabat yang menyimpan begitu banyak cerita,
            untuk dua orang yang hari ini memulai cerita baru.
          </p>

          <button
            className="opening-button"
            onClick={openExperience}
          >
            RAYAKAN HARI INI <span>♡</span>
          </button>

          <span className="opening-date">
            30 · 10 · 2026
          </span>

          <span className="opening-music">
            ♫ Dengarkan musik dan buka album kenangan
          </span>
        </div>
      </div>

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

          <button onClick={() => scrollTo("couple")}>
            Rendy & Dilla
          </button>

          <button onClick={() => scrollTo("letter")}>
            Ucapan
          </button>
        </div>
      </nav>

      {/* ================================== */}
      {/* 02 - HERO */}
      {/* ================================== */}

      <section className="hero" id="home">
        <div className="hero-image">
          <img
            src="/images/cover.webp"
            alt="Kenangan bersama sahabat"
          />
        </div>

        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="eyebrow light">
            SEBUAH ALBUM DARI SAHABAT
          </p>

          <h1>
            Sebelum Hari Ini,
            <br />
            Ada Begitu Banyak
            <br />
            <em>Cerita Kita.</em>
          </h1>

          <p className="hero-subtitle">
            Tentang persahabatan, tawa, dan perjalanan
            yang membawa kita sampai pada hari istimewa ini.
          </p>
        </div>

        <div className="hero-bottom">
          <span>DIBUAT DENGAN PENUH KASIH</span>
          <span>30 · 10 · 2026</span>
          <span>GULIR UNTUK MENGENANG ↓</span>
        </div>
      </section>

      {/* ================================== */}
      {/* 03 - AWAL CERITA */}
      {/* ================================== */}

      <section className="introduction section-padding">
        <div className="intro-decoration">✳</div>

        <div className="intro-content">
          <p className="eyebrow">
            BABAK 01 — AWAL DARI SEGALA CERITA
          </p>

          <h2 className="intro-heading">
            Dari sebuah pertemuan,
            <br />
            tumbuh menjadi <em>persahabatan.</em>
          </h2>

          <p className="intro-text reveal">
            Kita dipertemukan melalui PPA. Dari masa sekolah,
            kebersamaan di gereja, hingga berbagai cerita
            yang terus bertambah seiring waktu.

            <br /><br />

            Ada Gondal Gandul, ada Kembar Suram. Dua nama
            yang lahir dari candaan, tetapi menjadi bagian
            dari perjalanan persahabatan yang begitu berarti.

            <br /><br />

            Kita tumbuh, memiliki kesibukan, dan menempuh
            jalan masing-masing. Namun selalu ada waktu
            untuk kembali berkumpul, berbagi cerita,
            dan tertawa seperti biasanya.
          </p>

          <div className="intro-bottom">
            <span>GONDAL GANDUL & KEMBAR SURAM</span>
            <span>KENANGAN KITA</span>
          </div>
        </div>
      </section>

      {/* ================================== */}
      {/* 04 - MEMORY GALLERY */}
      {/* ================================== */}

      <section className="memories section-padding" id="memories">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">
              BABAK 02 — POTONGAN KENANGAN
            </p>

            <h2>
              Enam orang, dua nama,
              <br />
              <em>begitu banyak cerita.</em>
            </h2>
          </div>

          <p className="heading-note">
            Tidak semua momen harus sempurna.
            Sebagian justru menjadi istimewa karena
            kita menjalaninya bersama.
          </p>
        </div>


      <div className="memory-gallery-grid">
        {memories.map((item, index) => (
          <button
            type="button"
            className={`memory-tile memory-tile-${(index % 6) + 1}`}
            key={item.image}
            onClick={() => openPhoto(index, "memory")}
            aria-label={`Buka foto kenangan ${index + 1}`}
          >
            <div className="memory-index">
              <span>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="memory-index-total">
                / {memories.length}
              </span>
            </div>

            <Photo
              src={`/images/memories/${item.image}`}
              alt={item.caption}
              style={{ objectPosition: item.position || "center center" }}
            />

            <div className="memory-caption">
              <p>{item.caption}</p>
            </div>
          </button>
        ))}
      </div>


        <div className="gallery-note">
          <span>GONDAL GANDUL</span>
          <span>♡</span>
          <span>KEMBAR SURAM</span>
        </div>
      </section>


      {/* ================================== */}
      {/* 05 - TRANSITION TO COUPLE */}
      {/* ================================== */}

      <section className="transition-section" id="transition">
        <div className="transition-decoration">✳</div>

        <div className="transition-content reveal">
          <p className="eyebrow">
            BABAK 03 — CERITA YANG KITA RAYAKAN
          </p>

          <span className="transition-number">01 / 02</span>

          <h2>
            Dari sekian banyak
            <br />
            cerita yang kita punya,
            <br />
            ada satu cerita yang
            <br />
            <em>begitu istimewa.</em>
          </h2>

          <p>
            Kita telah melewati begitu banyak hal bersama.
            Tumbuh, tertawa, berbagi cerita, dan menciptakan
            kenangan yang akan selalu kita bawa.

            <br /><br />

            Namun hari ini, ada cerita lain yang ingin
            kita rayakan. Cerita tentang dua sahabat yang
            kini memilih untuk berjalan bersama,
            membangun kehidupan, dan menuliskan kisah
            baru sebagai satu keluarga.

            <br /><br />

            Dan dua orang itu adalah...
          </p>

          <div className="transition-names">
            <span>RENDY</span>
            <span className="transition-ampersand">&</span>
            <span>DILLA</span>
          </div>
        </div>

        <div className="transition-image reveal">
          <Photo
            src="/images/couple/couple_01.webp"
            alt="Rendy dan Dilla"
            onClick={() => openPhoto(0, "couple")}
          />

          <span className="transition-image-caption">
            A NEW CHAPTER BEGINS
          </span>
        </div>
      </section>


      {/* ================================== */}
      {/* 06 - COUPLE GALLERY */}
      {/* ================================== */}

      <section className="couple-gallery section-padding" id="couple">
        <div className="couple-heading reveal">
          <p className="eyebrow">
            BABAK 04 — RENDY & DILLA
          </p>

          <h2>
            Dua hati,
            <br />
            <em>satu perjalanan.</em>
          </h2>

          <p>
            Sepuluh potongan cerita, yang hari ini
            menjadi bagian dari perjalanan baru kalian.
          </p>
        </div>

        <div className="couple-gallery-grid">
          {couplePhotos.map((item, index) => (
            <button
              type="button"
              className={`couple-photo couple-photo-${(index % 5) + 1}`}
              key={item.image}
              onClick={() => openPhoto(index, "couple")}
              aria-label={`Buka foto Rendy dan Dilla ${index + 1}`}
            >
              <div className="couple-index">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="couple-index-total">/ {couplePhotos.length}</span>
              </div>

              <Photo
                src={`/images/couple/${item.image}`}
                alt={item.caption}
              />

              <div className="couple-caption">
                <p>{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>


        {/* ================================== */}
        {/* 07 - LETTER */}
        {/* ================================== */}

        <section className="letter-section" id="letter">
          <div className="letter-inner reveal">

            <p className="eyebrow">
              BABAK 05 — SEBUAH SURAT DARI SAHABAT
            </p>

            <span className="letter-flower">✳</span>

            <h2>
              Ada ucapan yang ingin kami
              <br />
              <em>sampaikan dari hati.</em>
            </h2>

            {!letterOpened ? (
              <div className="letter-envelope">
                <div className="envelope-icon">✉</div>

                <p>
                  Sebuah pesan kecil,
                  <br />
                  untuk dua orang yang istimewa.
                </p>

                <button
                  className="letter-open-button"
                  onClick={() => setLetterOpened(true)}
                >
                  BUKA SURAT <span>♡</span>
                </button>
              </div>
            ) : (
              <div className="letter-paper letter-paper-open">

                <span className="letter-dear">
                  Untuk Rendy dan Dilla,
                </span>

                <p>
                  Rasanya begitu banyak cerita yang telah kita
                  lalui bersama. Dari masa sekolah, kebersamaan
                  di gereja, hingga pertemuan-pertemuan sederhana
                  yang selalu berhasil menghadirkan tawa.
                </p>

                <p>
                  Rendy, terima kasih sudah menjadi bagian
                  penting dari perjalanan persahabatan ini.
                  Terima kasih untuk bantuan, nasihat,
                  perhatian, dan pengingat yang selama ini
                  begitu berarti. Banyak hal yang akan selalu
                  aku hargai dari persahabatan kita.
                </p>

                <p>
                  Dan hari ini, kami turut bersukacita melihatmu
                  memulai perjalanan baru bersama Dilla.
                  Sebuah perjalanan yang akan menghadirkan
                  cerita, tanggung jawab, dan pengalaman
                  yang berbeda dari sebelumnya.
                </p>

                <p>
                  Rendy dan Dilla, semoga kalian selalu punya
                  kesabaran untuk saling memahami, kekuatan
                  untuk saling menguatkan, dan kasih untuk
                  tetap memilih satu sama lain dalam setiap keadaan.
                </p>

                <p>
                  Akan ada hari yang penuh sukacita, tetapi
                  mungkin juga ada hari yang tidak mudah.
                  Semoga kalian selalu berjalan bersama,
                  saling menjaga, dan menjadikan Tuhan
                  sebagai dasar dalam membangun kehidupan keluarga.
                </p>

                <p>
                  Terima kasih telah menjadi bagian dari
                  cerita kami. Hari ini, izinkan kami ikut
                  merayakan salah satu babak terindah
                  dalam kehidupan kalian.
                </p>

                <p>
                  <strong>
                    Selamat menempuh hidup baru.
                    Berbahagialah selalu, Rendy dan Dilla.
                  </strong>
                </p>

                <span className="letter-end">
                  Dengan penuh kasih,
                </span>

                <span className="letter-signature">
                  Sahabat-sahabat kalian ♡
                </span>

              </div>
            )}

          </div>
        </section>


      {/* ================================== */}
      {/* 08 - CLOSING */}
      {/* ================================== */}

      <section className="closing">
      <div className="closing-image">
        <img
          src="/images/couple/footer.webp"
          alt="Rendy dan Dilla"
        />
      </div>

        <div className="closing-overlay" />

        <div className="closing-content reveal">
          <p className="eyebrow light">
            BABAK 06 — SEBUAH AWAL YANG BARU
          </p>

          <span className="closing-heart">♡</span>

          <h2>
            Cerita kalian
            <br />
            <em>baru saja dimulai.</em>
          </h2>

          <p>
            Teruslah saling mengasihi, saling menjaga,
            dan bertumbuh bersama dalam setiap musim kehidupan.

            <br /><br />

            Dari kami yang pernah tumbuh bersama kalian,
            doa dan harapan terbaik akan selalu menyertai
            perjalanan baru ini.

            <br /><br />

            Selamat menempuh hidup baru.
          </p>

          <span className="closing-names">
            RENDY & DILLA
          </span>

          <span className="closing-date">
            WITH LOVE, FROM YOUR FRIENDS
          </span>

          <button
              className="closing-button"
              onClick={() => scrollTo("home")}
            >
              KEMBALI KE AWAL CERITA ↑
            </button>
        </div>
      </section>

      {/* ================================== */}
      {/* FOOTER */}
      {/* ================================== */}

      <footer className="footer">
        <span>DIBUAT DENGAN PENUH KASIH ♡</span>

        <span>GONDAL GANDUL & KEMBAR SURAM</span>

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
          onClick={closeLightbox}
        >
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Tutup foto"
          >
            ×
          </button>

          <button
            className="lightbox-nav lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              changePhoto(-1);
            }}
            aria-label="Foto sebelumnya"
          >
            ‹
          </button>

          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <Photo
              src={
                lightbox.type === "memory"
                  ? `/images/memories/${memories[lightbox.index].image}`
                  : `/images/couple/${couplePhotos[lightbox.index].image}`
              }
              alt={
                lightbox.type === "memory"
                  ? memories[lightbox.index].caption
                  : couplePhotos[lightbox.index].caption
              }
            />

            <p className="lightbox-caption">
              {lightbox.type === "memory"
                ? memories[lightbox.index].caption
                : couplePhotos[lightbox.index].caption}
            </p>

            <span className="lightbox-counter">
              {String(lightbox.index + 1).padStart(2, "0")}
              {" / "}
              {String(
                lightbox.type === "memory"
                  ? memories.length
                  : couplePhotos.length
              ).padStart(2, "0")}
            </span>
          </div>

          <button
            className="lightbox-nav lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              changePhoto(1);
            }}
            aria-label="Foto berikutnya"
          >
            ›
          </button>
        </div>
      )}

      {/* ================================== */}
      {/* BACKGROUND MUSIC */}
      {/* ================================== */}

      <audio
        id="wedding-audio"
        src="/audio/wedding-song.mpeg"
        loop
        preload="auto"
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
