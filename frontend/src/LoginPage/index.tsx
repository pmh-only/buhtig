import { type FormEvent, type FC, useState, createRef } from 'react'
import { motion, useAnimate } from 'framer-motion'
import PageContainer from '../PageContainer'

import style from './style.module.scss'

const LoginPage: FC = () => {
  const [scope, animate] = useAnimate()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const passwordRef = createRef<HTMLInputElement>()

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault()

    if (isLoading) return
    setIsLoading(true)

    void (async () => {
      const res = await fetch('/api/auth/by-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: id,
          password
        })
      }).then(async (res) => await res.json()) as { success: boolean }

      if (!res.success) {
        void animate(scope.current, { opacity: 1 })
        setIsLoading(false)
        setPassword('')
        console.log(passwordRef.current)
        passwordRef.current?.focus()

        setTimeout(() => {
          void animate(scope.current, { opacity: 0 })
        }, 1000)
        return
      }

      window.location.assign('/')

      setIsLoading(false)
    })()
  }

  return (
    <PageContainer>
      <form className={style.form} onSubmit={onSubmit}>
        <h2>login.{isLoading ? '..' : ''}</h2>

        <input
          disabled={isLoading}
          type="text"
          value={id}
          onChange={(e) => { setId(e.target.value) }}
          placeholder="login id" />

        <input
          ref={passwordRef}
          disabled={isLoading}
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
          placeholder="password" />

        <motion.p initial={{ opacity: 0 }} ref={scope}>
          wrong id or pw
        </motion.p>

        <button>login</button>
      </form>
    </PageContainer>
  )
}

export default LoginPage
