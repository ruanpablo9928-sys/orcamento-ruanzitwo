import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const VIDEOS = [
  { id: '481-Zvh8ROY' }, { id: 'cxTJsL4ykDA' }, { id: 'aW3pl6_WlTA' },
  { id: 'dKvzlmju_Sc' }, { id: 'GGuzcLaSrqA' }, { id: 'bfkqtuUz0bY' },
]

const FEATURES = [
  'Edição profissional completa',
  'Motion design nos vídeos',
  'Até 2 minutos de vídeo final',
  '2 rodadas de revisão',
  'Cortes dinâmicos e transições',
  'Color grading profissional',
  'Edição premium com efeitos',
  'Prioridade na entrega',
  'Suporte via WhatsApp',
]

const fade = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

function Reveal({ children, delay = 0, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] }}
    >{children}</motion.div>
  )
}

function Counter({ to }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let c = 0; const step = Math.ceil(to / 40)
    const id = setInterval(() => { c += step; if (c >= to) { c = to; clearInterval(id) }; setN(c) }, 30)
    return () => clearInterval(id)
  }, [inView, to])
  return <span ref={ref}>{n}+</span>
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modal, setModal] = useState(null)
  const [sent, setSent] = useState(false)
  const [qty, setQty] = useState('')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const qtyNum = parseInt(qty) || 0
  const unit = qtyNum >= 5 ? 80 : 150
  const total = qtyNum * unit

  const maskPhone = (v) => {
    v = v.replace(/\D/g, '').slice(0, 11)
    if (v.length > 7) return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`
    if (v.length > 2) return `(${v.slice(0,2)}) ${v.slice(2)}`
    return v.length > 0 ? `(${v}` : v
  }

  const submit = (e) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.target))
    let m = `*Novo Orçamento - ruanzitwo*\n\n`
    m += `*Nome:* ${d.nome}\n*WhatsApp:* ${d.whatsapp}\n`
    if (d.instagram) m += `*Instagram:* ${d.instagram}\n`
    m += `*Tipo:* ${d.tipo}\n*Qtd:* ${d.quantidade} vídeo(s)\n*Objetivo:* ${d.objetivo}\n`
    if (d.descricao) m += `*Descrição:* ${d.descricao}\n`
    if (d.referencia) m += `*Referência:* ${d.referencia}\n`
    m += `\n*Valor estimado:* R$ ${total}`
    window.open(`https://wa.me/5588996117377?text=${encodeURIComponent(m)}`, '_blank')
    setSent(true)
  }

  return (
    <>
      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            ruanzi<span>two</span>
          </div>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><a href="#trabalhos" onClick={() => setMenuOpen(false)}>Trabalhos</a></li>
            <li><a href="#precos" onClick={() => setMenuOpen(false)}>Preços</a></li>
            <li><a href="#orcamento" onClick={() => setMenuOpen(false)} className="nav-cta-link">Orçamento</a></li>
          </ul>
          <button className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <motion.div className="hero-inner"
          initial="hidden" animate="show"
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.div className="hero-tag" variants={fade}>
            <div className="hero-dot" />
            Disponível para projetos
          </motion.div>
          <motion.h1 variants={fade}>
            Edição que faz<br />seu conteúdo <em>vender</em>
          </motion.h1>
          <motion.p variants={fade}>
            Vídeos profissionais com cortes dinâmicos, efeitos e color grading
            que transformam viewers em clientes.
          </motion.p>
          <motion.div className="hero-actions" variants={fade}>
            <a href="#orcamento" className="btn btn-fill">Solicitar orçamento</a>
            <a href="#trabalhos" className="btn btn-outline"><i className="fas fa-play" style={{ fontSize: '0.7rem' }} /> Ver trabalhos</a>
          </motion.div>
        </motion.div>
      </section>

      <div className="divider" />

      {/* PORTFOLIO */}
      <section className="section" id="trabalhos">
        <Reveal>
          <div className="section-header section-header-center">
            <div className="section-label">Portfólio</div>
            <h2 className="section-title">Trabalhos recentes</h2>
            <p className="section-desc">Alguns dos vídeos que editei. Clique para assistir.</p>
          </div>
        </Reveal>
        <div className="portfolio-grid">
          {VIDEOS.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.08}>
              <div className="vid-card" onClick={() => setModal(v.id)}>
                <div className="thumb-wrap">
                  <img className="thumb" src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
                  <div className="play-icon"><i className="fas fa-play" /></div>
                </div>
                <div className="vid-label">Edição profissional</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* PRICING */}
      <section className="section" id="precos">
        <Reveal>
          <div className="section-header section-header-center">
            <div className="section-label">Preços</div>
            <h2 className="section-title">Simples e transparente</h2>
            <p className="section-desc">Dois planos. Mesmos benefícios. Sem pegadinha.</p>
          </div>
        </Reveal>
        <div className="pricing-grid">
          <Reveal delay={0.1}>
            <div className="p-card">
              <div className="p-tag">Avulso</div>
              <h3>Vídeo Único</h3>
              <div className="p-price"><span className="cur">R$</span>150<small> /vídeo</small></div>
              <p className="p-desc">Para quem precisa de um vídeo pontual com qualidade profissional.</p>
              <ul className="p-list">
                {FEATURES.map((f, i) => (
                  <li key={i}><span className="check"><i className="fas fa-check" /></span> {f}</li>
                ))}
              </ul>
              <a href="#orcamento" className="btn btn-outline btn-full">Solicitar orçamento</a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="p-card pop">
              <div className="p-tag">Pacote</div>
              <h3>5+ Vídeos</h3>
              <div className="discount-box">
                <strong>-47% OFF</strong>
                <small>Desconto exclusivo para pacotes</small>
              </div>
              <div className="p-price">
                <span className="p-old">R$ 150</span>
                <span className="cur">R$</span>80<small> /vídeo</small>
              </div>
              <div className="save-note"><i className="fas fa-tag" style={{ fontSize: '0.65rem' }} /> Economia de R$ 70 por vídeo</div>
              <div className="compare-line">5 vídeos = <b>R$ 400</b> ao invés de R$ 750</div>
              <p className="p-desc" style={{ marginTop: '1rem' }}>Para criadores que precisam de volume com consistência.</p>
              <ul className="p-list">
                {FEATURES.map((f, i) => (
                  <li key={i}><span className="check"><i className="fas fa-check" /></span> {f}</li>
                ))}
              </ul>
              <a href="#orcamento" className="btn btn-fill btn-full">Quero esse plano</a>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="divider" />

      {/* FORM */}
      <section className="section" id="orcamento">
        <Reveal>
          <div className="section-header section-header-center">
            <div className="section-label">Orçamento</div>
            <h2 className="section-title">Vamos trabalhar juntos</h2>
            <p className="section-desc">Preencha e te respondo pelo WhatsApp.</p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="form-wrap">
            {!sent ? (
              <form className="form-grid" onSubmit={submit}>
                <div className="fg">
                  <label>Nome *</label>
                  <input name="nome" placeholder="Seu nome" required />
                </div>
                <div className="fg">
                  <label>WhatsApp *</label>
                  <input name="whatsapp" placeholder="(00) 00000-0000" required onChange={e => { e.target.value = maskPhone(e.target.value) }} />
                </div>
                <div className="fg">
                  <label>Instagram</label>
                  <input name="instagram" placeholder="@seuuser" />
                </div>
                <div className="fg">
                  <label>Tipo de vídeo *</label>
                  <select name="tipo" required defaultValue="">
                    <option value="" disabled>Selecione</option>
                    <option>Reels / Shorts</option>
                    <option>YouTube</option>
                    <option>TikTok</option>
                    <option>Institucional</option>
                    <option>Gaming / Highlights</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div className="fg">
                  <label>Quantos vídeos? *</label>
                  <select name="quantidade" required value={qty} onChange={e => setQty(e.target.value)}>
                    <option value="" disabled>Selecione</option>
                    {[1,2,3,4,5,6,7,8,9,10,15,20].map(n =>
                      <option key={n} value={n}>{n}{n===20?'+':''} vídeo{n>1?'s':''}</option>
                    )}
                  </select>
                </div>
                <div className="fg">
                  <label>Objetivo *</label>
                  <input name="objetivo" placeholder="Engajamento, vendas..." required />
                </div>
                <div className="fg full">
                  <label>Descrição</label>
                  <textarea name="descricao" placeholder="Estilo, referências, efeitos..." />
                </div>
                <div className="fg full">
                  <label>Link de referência</label>
                  <input name="referencia" placeholder="https://..." />
                </div>
                {qtyNum > 0 && (
                  <motion.div className="price-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div>
                      <div className="price-bar-label">Valor estimado</div>
                      <div className="price-bar-detail">
                        {qtyNum}x R${unit}{qtyNum >= 5 ? ` — economia de R$${qtyNum*150-total}` : ''}
                      </div>
                    </div>
                    <div className="price-bar-val">R$ {total}</div>
                  </motion.div>
                )}
                <div className="form-bottom">
                  <button type="submit" className="btn btn-fill btn-full">
                    <i className="fab fa-whatsapp" /> Enviar pelo WhatsApp
                  </button>
                </div>
              </form>
            ) : (
              <motion.div className="done-msg" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="done-icon"><i className="fas fa-check" /></div>
                <h3>Orçamento enviado!</h3>
                <p>Te respondo em breve pelo WhatsApp.</p>
              </motion.div>
            )}
          </div>
        </Reveal>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {modal && (
          <motion.div className="modal-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <button className="modal-x" onClick={() => setModal(null)}>&times;</button>
            <motion.div className="modal-frame"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <iframe src={`https://www.youtube.com/embed/${modal}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="foot">
        <div className="foot-logo">ruanzi<span>two</span></div>
        <div className="foot-links">
          <a href="https://instagram.com/ofruanzitwo" target="_blank" rel="noreferrer"><i className="fab fa-instagram" /></a>
          <a href="https://youtube.com/@ruanzitwo" target="_blank" rel="noreferrer"><i className="fab fa-youtube" /></a>
          <a href="https://tiktok.com/@ruanzitwo" target="_blank" rel="noreferrer"><i className="fab fa-tiktok" /></a>
        </div>
        <p className="foot-copy">&copy; 2026 ruanzitwo</p>
      </footer>
    </>
  )
}
