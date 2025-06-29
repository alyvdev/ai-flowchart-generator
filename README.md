# 🤖 AI Blok-Sxem Alqoritm Generatoru

**AI ilə Alqoritm Blok-Sxemlərinin Avtomatik Yaradılması**

Bu layihə süni intellekt (Google Gemini AI) istifadə edərək alqoritm təsvirlərindən interaktiv blok-sxemlər yaradan müasir veb tətbiqidir. İstifadəçilər sadəcə alqoritmlərin təsvirini daxil edərək peşəkar blok-sxemlər əldə edə və onlar haqqında AI ilə söhbət edə bilərlər.

## ✨ Əsas Xüsusiyyətlər

### 🎯 AI-Powered Blok-Sxem Generasiyası

- **25+ Proqramlaşdırma Dili Dəstəyi**: JavaScript, Python, Java, C++, C#, PHP, Ruby, Go, Rust və s.
- **Google Gemini 2.0 Flash AI**: AI texnologiyası ilə dəqiq blok-sxem yaradılması
- **Mermaid.js İnteqrasiyası**: Peşəkar və interaktiv diaqramlar

### 🖥️ İstifadəçi Dostu İnterfeys

- **Qaranlıq Tema**: Müasir və gözə rahat dizayn
- **Üç Panelli Layout**:
  - Sol tərəf: Söhbət tarixçəsi
  - Mərkəz: Alqoritm girişi və blok-sxem
  - Sağ tərəf: AI söhbət paneli
- **Responsive Dizayn**: Bütün cihazlarda mükəmməl görünüş

### 🔍 İnteraktiv Blok-Sxem Xüsusiyyətləri

- **Pan & Zoom**: Blok-sxemləri böyüdüb kiçildə və hərəkət etdirə bilərsiniz
- **Klikləmə Detalları**: Hər bloka klik edərək ətraflı izahat əldə edin
- **Kod Nümunələri**: Hər addım üçün müvafiq proqramlaşdırma dili kodları

### 💬 AI Söhbət Sistemi

- **Kontekstual Söhbət**: Yaradılmış blok-sxem haqqında suallar verin
- **Markdown Dəstəyi**: Zəngin mətn formatlaması
- **Real-time Cavablar**: Sürətli və dəqiq AI cavabları

### 📚 Sessiya İdarəetməsi

- **Avtomatik Yadda Saxlama**: Bütün işləriniz brauzer yaddaşında saxlanılır
- **Çoxlu Sessiya**: Eyni vaxtda müxtəlif layihələr üzərində işləyin
- **Ağıllı Adlandırma**: Sessiyanın adı avtomatik olaraq alqoritm təsvirindən yaradılır
- **Düzəltmə və Silmə**: Sessiya adlarını dəyişdirin və ya sessiyanı silin

## 🛠️ Texnologiyalar

### Frontend

- **HTML5** - Struktur
- **CSS3** - Stilizasiya (Custom CSS Variables)
- **JavaScript (ES6+)** - Funksionallıq
- **Tailwind CSS** - Utility-first CSS framework

### Kitabxanalar

- **Mermaid.js** - Diaqram yaradılması
- **SVG Pan Zoom** - İnteraktiv zoom və pan
- **Marked.js** - Markdown parser
- **Google Fonts (Inter)** - Tipografiya

### AI & API

- **Google Gemini 2.0 Flash API** - AI blok-sxem generasiyası
- **REST API** - AI ilə əlaqə

## 📋 Quraşdırma

### Tələblər

- Modern veb brauzer (Chrome, Firefox, Safari, Edge)
- İnternet bağlantısı (AI API üçün)
- Google Gemini API açarı

### Lokal Quraşdırma

1. **Layihəni klonlayın**

```bash
git clone https://github.com/alyvdev/ai-flowchart-generator.git
cd ai-flowchart-generator
```

2. **API açarını konfiqurasiya edin**

```javascript
// index.html faylında API açarını dəyişdirin
const apiKey = "YOUR_GEMINI_API_KEY_HERE";
```

3. **Lokal server başladın**

```bash
# Python ilə
python -m http.server 8000

# Node.js ilə
npx serve .

# PHP ilə
php -S localhost:8000
```

4. **Brauzerdə açın**

```
http://localhost:8000
```

## 🔧 Konfigurasiya

### Google Gemini API Açarı Əldə Etmək

1. [Google AI Studio](https://makersuite.google.com/app/apikey) saytına daxil olun
2. Yeni API açarı yaradın
3. API açarını `index.html` faylında dəyişdirin:

```javascript
const apiKey = "YOUR_GEMINI_API_KEY_HERE";
```

### Dəstəklənən Proqramlaşdırma Dilləri

Tətbiq aşağıdakı proqramlaşdırma dillərini dəstəkləyir:

- JavaScript, TypeScript
- Python
- Java, Kotlin
- C++, C#
- PHP
- Ruby
- Go, Rust
- Swift
- SQL
- HTML/CSS
- və daha çoxu...

## 📖 İstifadə Təlimatı

### 1. Alqoritm Təsviri Daxil Edin

```
Məsələn: İstifadəçidən alınan ədədin cüt və ya tək olduğunu
yoxlayıb nəticəni MySQL verilənlər bazasına yazan proqramın alqoritmi
```

### 2. Proqramlaşdırma Dilini Seçin

Dropdown menyudan istədiyiniz proqramlaşdırma dilini seçin.

### 3. Blok-Sxem Yaradın

"Generasiya et" düyməsini basın və AI sizin üçün blok-sxem yaradacaq.

### 4. İnteraktiv Xüsusiyyətlərdən İstifadə Edin

- Blok-sxemi böyüdüb kiçildin
- Bloklara klik edərək ətraflı məlumat əldə edin
- AI ilə söhbət edin

### 5. Sessiyanı İdarə Edin

- Yeni sessiya yaradın
- Sessiya adını dəyişdirin
- Köhnə sessiyaları silin

## 🎨 Xüsusiyyətlər

### Tema Dəyişkənləri

```css
:root {
  --background: #000000;
  --surface-1: #111111;
  --surface-2: #1f1f1f;
  --surface-3: #2c2c2c;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: #3a3a3a;
  --accent-color: #ffffff;
  --accent-text: #000000;
}
```

### Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🤝 Töhfə Vermək

Bu layihəyə töhfə vermək istəyirsinizsə:

1. **Fork edin**
2. **Feature branch yaradın** (`git checkout -b feature/amazing-feature`)
3. **Dəyişikliklərinizi commit edin** (`git commit -m 'Add amazing feature'`)
4. **Branch-ı push edin** (`git push origin feature/amazing-feature`)
5. **Pull Request açın**

### Töhfə Qaydaları

- Kod standartlarına riayət edin
- Commit mesajlarını aydın yazın
- Dokumentasiyanı yeniləyin
- Test edin

## 📝 Lisenziya

Bu layihə MIT Lisenziyası altında paylaşılır. Ətraflı məlumat üçün [LICENSE](LICENSE) faylına baxın.

## 👥 Müəlliflər

- **Ali Aliyev** - _İlkin İnkişaf_ - [@alyvdev](https://github.com/alyvdev)

## 🙏 Təşəkkürlər

- [Google Gemini AI](https://ai.google.dev/) - AI API
- [Mermaid.js](https://mermaid.js.org/) - Diaqram kitabxanası
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [SVG Pan Zoom](https://github.com/bumbu/svg-pan-zoom) - İnteraktiv zoom

## 📞 Əlaqə

- **Email**: alyvdev@gmail.com
- **GitHub**: [@alyvdev](https://github.com/alyvdev)
- **LinkedIn**: [Ali Aliyev](https://linkedin.com/in/alyvofficial)

## 🐛 Problemlər

Problem tapdınızsa və ya təklif vermək istəyirsinizsə, [Issues](https://github.com/alyvdev/ai-flowchart-generator/issues) bölməsində bildirin.

## 🚀 Production Deployment

### Netlify ilə Deploy

1. **GitHub-a push edin**
2. **Netlify-də yeni site yaradın**
3. **Environment variables əlavə edin**
4. **Build settings konfiqurasiya edin**

### Vercel ilə Deploy

1. **Vercel CLI quraşdırın**

```bash
npm i -g vercel
```

2. **Deploy edin**

```bash
vercel --prod
```

### GitHub Pages ilə Deploy

1. **GitHub Actions workflow yaradın**
2. **gh-pages branch yaradın**
3. **Settings > Pages-də konfiqurasiya edin**

## 📊 Performance

### Optimizasiya Tövsiyələri

- **CDN istifadə edin** - Statik fayllar üçün
- **Lazy loading** - Böyük komponentlər üçün
- **Caching** - API cavabları üçün
- **Minification** - CSS və JS faylları üçün
- **Image optimization** - Şəkillər üçün

### Monitoring

- **Google Analytics** - İstifadəçi davranışı
- **Sentry** - Error tracking
- **Lighthouse** - Performance audit

---

⭐ **Bu layihəni bəyəndinizsə, ulduz verməyi unutmayın!**

📢 **Sosial mediada paylaşın və dostlarınıza tövsiyə edin!**
