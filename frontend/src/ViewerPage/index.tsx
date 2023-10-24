import { type FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../PageContainer'
import useSWR from 'swr'
import { motion, useMotionValue } from 'framer-motion'
import Editor from '@monaco-editor/react'

import style from './style.module.scss'

const fetcher = async (path: string): Promise<any> =>
  await fetch(path).then(async (res) => await res.text())

const ViewerPage: FC = () => {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const editorOpacity = useMotionValue(1)
  const { data: filesCall } = useSWR(`/api/objects/${fileId}`, fetcher)

  // useEffect(() => {
  //   monaco.editor.defineTheme('default', {
  //     base: 'vs',
  //     inherit: true,
  //     rules: [],
  //     colors: {
  //       'editor.background': '#eeeeee'
  //     }
  //   })

  //   monaco.editor.setTheme('default')
  // }, [])

  return (
    <PageContainer>
      <ul className={style.files}>
        <li className={style.clickable} onClick={() => { navigate(-1) }}>
          돌아가기
        </li>
        {filesCall !== undefined && (
          <motion.li
            style={{ opacity: editorOpacity }}>
            <Editor
              key={fileId}
              width="97%"
              height="90vh"
              defaultValue={filesCall}
              options={{
                domReadOnly: true,
                readOnly: true,
                smoothScrolling: true,
                minimap: {
                  enabled: false
                },
                theme: 'default',
                cursorSmoothCaretAnimation: 'on',
                cursorStyle: 'underline-thin'
              }}
              beforeMount={(monaco) => {
                monaco.editor.defineTheme('default', {
                  base: 'vs',
                  inherit: true,
                  rules: [],
                  colors: {
                    'editor.background': '#eeeeee'
                  }
                })
              }}
              theme="default"
              language="typescript"
              />
          </motion.li>
        )}
      </ul>

    </PageContainer>
  )
}

export default ViewerPage
