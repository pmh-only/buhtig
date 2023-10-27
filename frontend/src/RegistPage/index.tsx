import { type FormEvent, type FC, useState, createRef } from 'react'
import { motion, useAnimate } from 'framer-motion'
import PageContainer from '../PageContainer'

import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'

const RegistPage: FC = () => {
  const [message, setMessage] = useState('')
  const [scope, animate] = useAnimate()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordChk, setPasswordChk] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const passwordRef = createRef<HTMLInputElement>()

  const navigate = useNavigate()
  const onSubmit = (e: FormEvent): void => {
    e.preventDefault()

    if (isLoading) return
    setIsLoading(true)

    if (id.length < 1 || password.length < 1) {
      setMessage('Please provide longer id & secure pw.')
      setIsLoading(false)
      void animate(scope.current, { opacity: 1 })

      setTimeout(() => {
        void animate(scope.current, { opacity: 0 })
      }, 1000)
      return
    }

    if (password !== passwordChk) {
      setMessage('Password check failed.')
      setIsLoading(false)
      void animate(scope.current, { opacity: 1 })

      setTimeout(() => {
        void animate(scope.current, { opacity: 0 })
      }, 1000)
      return
    }

    void (async () => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: id,
          plainPassword: password,
          bio
        })
      }).then(async (res) => await res.json()) as { success: boolean }

      if (!res.success) {
        void animate(scope.current, { opacity: 1 })
        setIsLoading(false)
        setPassword('')

        setMessage('Login id already in use, id too short or insecure pw provided.')
        passwordRef.current?.focus()

        setTimeout(() => {
          void animate(scope.current, { opacity: 0 })
        }, 1000)
        return
      }

      navigate('/login')
      setIsLoading(false)
    })()
  }

  return (
    <PageContainer>
      <form className={style.form} onSubmit={onSubmit}>
        <h2>regist.{isLoading ? '..' : ''}</h2>

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

        <input
          disabled={isLoading}
          type="password"
          value={passwordChk}
          onChange={(e) => { setPasswordChk(e.target.value) }}
          placeholder="password check" />

        <textarea
          disabled={isLoading}
          value={bio}
          onChange={(e) => { setBio(e.target.value) }}
          placeholder="bio (optional)" />

        <motion.p initial={{ opacity: 0 }} ref={scope}>
          {message}
        </motion.p>

        <button>regist</button>
      </form>
    </PageContainer>
  )
}

export default RegistPage
