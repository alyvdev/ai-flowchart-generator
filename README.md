# AI Blok-Sxem Alqoritm Generatoru

Bu layihə alqoritm təsvirlərindən avtomatik blok-sxemlər yaradan veb tətbiqidir. Google Gemini AI istifadə edərək sadə mətn təsvirlərini peşəkar diaqramlara çevirir.

## Nə edir?

Alqoritminizi sadə dillə yazırsınız, proqramlaşdırma dilini seçirsiniz və sistem sizin üçün blok-sxem yaradır. Yaradılan diaqramla interaktiv şəkildə işləyə və AI ilə söhbət edə bilərsiniz.

## Əsas xüsusiyyətlər

**İki tərəfli generasiya (Two-way Generation)**

- **Təsvirdən blok-sxemə:** Alqoritminizi sadə mətnlə təsvir edin, sistem sizin üçün vizual blok-sxem yaratsın.
- **Koddan blok-sxemə:** Mövcud kodunuzu daxil edərək onun məntiqi axışını göstərən blok-sxem generasiya edin.
- **Təsvirdən koda:** Alqoritm təsvirindən həm blok-sxem, həm də seçilmiş proqramlaşdırma dilində tam işlək kod əldə edin.

**İxrac funksiyaları (Export)**

- Yaradılan blok-sxemləri **SVG**, **PNG** (şəffaf arxa fon ilə) və **PDF** formatlarında ixrac edin.

**Blok-sxem yaradılması**

- 9 proqramlaşdırma dili dəstəyi (C#, C++, Java, JavaScript, PHP, Python, SQL, Swift, TypeScript)
- Google Gemini 2.0 Flash AI texnologiyası
- Mermaid.js ilə peşəkar diaqramlar

**İstifadəçi interfeysi**

- Qaranlıq tema
- Üç panelli layout: tarixçə, əsas sahə, söhbət
- Bütün cihazlarda işləyir

**İnteraktiv xüsusiyyətlər**

- Diaqramları böyüdüb kiçildə bilərsiniz
- Bloklara klik edərək ətraflı məlumat əldə edin
- Hər addım üçün kod nümunələri

**AI söhbət**

- Yaradılan blok-sxem haqqında suallar verin
- Markdown formatında cavablar
- Real-time əlaqə

**Sessiya idarəetməsi**

- İşləriniz avtomatik saxlanılır
- Çoxlu layihə üzərində işləyin
- Sessiya adlarını dəyişdirin

## Texnologiyalar

**Frontend**

- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS

**Kitabxanalar**

- Mermaid.js (diaqram yaradılması)
- highlight.js (sintaksis işıqlandırma)
- html2canvas (PNG/PDF ixracı üçün)
- jsPDF (PDF ixracı üçün)
- SVG Pan Zoom (interaktiv zoom)
- Marked.js (markdown parser)
- Google Fonts (Inter)

**AI & API**

- Google Gemini 2.0 Flash API
- REST API

## Quraşdırma

**Tələblər**

- Modern veb brauzer
- İnternet bağlantısı
- Google Gemini API açarı

**İstifadə**

Bu tətbiqin quraşdırılması tələb olunmur. Sadəcə `index.html` faylını veb brauzerinizdə açın.

Alternativ olaraq, layihəni lokal serverdə işə sala bilərsiniz:

1.  Layihəni klonlayın:

    ```bash
    git clone https://github.com/alyvdev/ai-flowchart-generator.git
    cd ai-flowchart-generator
    ```

2.  Lokal server başladın (istənilən üsulla):

    ```bash
    # Python ilə
    python -m http.server

    # Node.js ilə (serve paketi tələb olunur)
    npx serve .
    ```

3.  Brauzerdə açın: `http://localhost:8000` (və ya serverin istifadə etdiyi port).

## Konfigurasiya

**Google Gemini API açarı əldə etmək və tənzimləmək**

1.  [Google AI Studio](https://makersuite.google.com/app/apikey) saytına daxil olub yeni bir API açarı yaradın.
2.  Tətbiqi brauzerdə açdıqdan sonra sol alt köşədəki **API Tənzimləmələri** düyməsini basın.
3.  Açılan pəncərədə əldə etdiyiniz API açarını müvafiq sahəyə daxil edib **Saxla** düyməsini basın.
4.  Açarınız brauzerinizin yaddaşında (Local Storage) saxlanılacaq və başqa heç bir yerə göndərilməyəcək.

**Dəstəklənən proqramlaşdırma dilləri**

C#, C++, Java, JavaScript, PHP, Python, SQL, Swift, TypeScript.

## İstifadə təlimatı

1. **Generasiya rejimini seçin**
   - **Təsvirə görə:** Alqoritminizi mətn şəklində təsvir etmək üçün bu rejimi seçin.
   - **Koda görə:** Mövcud kodu blok-sxemə çevirmək üçün bu rejimi seçin.

2. **Məlumatı daxil edin**
   - Seçilmiş rejimə uyğun olaraq təsvirinizi və ya kodunuzu mətn qutusuna daxil edin.

3. **Proqramlaşdırma dilini seçin**
   - Dropdown menyudan istədiyiniz dili seçin.

4. **Blok-sxem yaradın**
   - "Generasiya et" düyməsini basın.
   - Təsvir rejimində həm blok-sxem, həm də tam kod yaradılacaq.

5. **Nəticəyə baxın**
   - **Blok-sxem:** Sağ paneldə göstərilir.
   - **Kod:** Sol paneldə, tarixçənin altında yeni bir bölmədə göstərilir (yalnız təsvir rejimində).

4. **İnteraktiv xüsusiyyətlərdən istifadə edin**

   - Diaqramı böyüdüb kiçildin
   - Bloklara klik edərək ətraflı məlumat əldə edin
   - AI ilə söhbət edin

5. **Sessiyanı idarə edin**
   - Yeni sessiya yaradın
   - Sessiya adını dəyişdirin
   - Köhnə sessiyaları silin

## Töhfə vermək

Layihəyə töhfə vermək istəyirsinizsə:

1. Fork edin
2. Feature branch yaradın (`git checkout -b feature/amazing-feature`)
3. Dəyişikliklərinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch-ı push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

**Töhfə qaydaları**

- Kod standartlarına riayət edin
- Commit mesajlarını aydın yazın
- Dokumentasiyanı yeniləyin
- Test edin

## Lisenziya

Bu layihə MIT Lisenziyası altında paylaşılır. Ətraflı məlumat üçün [LICENSE](LICENSE) faylına baxın.

## Müəllif

Ali Aliyev - [@alyvdev](https://github.com/alyvdev)

## Təşəkkürlər

- [Google Gemini AI](https://ai.google.dev/) - AI API
- [Mermaid.js](https://mermaid.js.org/) - Diaqram kitabxanası
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [SVG Pan Zoom](https://github.com/bumbu/svg-pan-zoom) - İnteraktiv zoom

## Əlaqə

- Email: alyvdev@gmail.com
- GitHub: [@alyvdev](https://github.com/alyvdev)
- LinkedIn: [Ali Aliyev](https://linkedin.com/in/alyvofficial)

## Problemlər

Problem tapdınızsa və ya təklif vermək istəyirsinizsə, [Issues](https://github.com/alyvdev/ai-flowchart-generator/issues) bölməsində bildirin.

## Production Deployment

**Netlify ilə Deploy**

1. GitHub-a push edin
2. Netlify-də yeni site yaradın
3. Environment variables əlavə edin
4. Build settings konfiqurasiya edin

**Vercel ilə Deploy**

1. Vercel CLI quraşdırın: `npm i -g vercel`
2. Deploy edin: `vercel --prod`

**GitHub Pages ilə Deploy**

1. GitHub Actions workflow yaradın
2. gh-pages branch yaradın
3. Settings > Pages-də konfiqurasiya edin

## Performance

**Optimizasiya tövsiyələri**

- CDN istifadə edin (statik fayllar üçün)
- Lazy loading (böyük komponentlər üçün)
- Caching (API cavabları üçün)
- Minification (CSS və JS faylları üçün)
- Image optimization (şəkillər üçün)

**Monitoring**

- Google Analytics (istifadəçi davranışı)
- Sentry (error tracking)
- Lighthouse (performance audit)
