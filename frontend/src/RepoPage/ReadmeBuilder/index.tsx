import { type FC } from 'react'
import { Converter } from 'showdown'
import useSWR from 'swr'
import style from './style.module.scss'

interface Props {
  physical?: string
}

const fetcher = async (path: string): Promise<string> =>
  await fetch(path).then(async (res) => await res.text())

const ReadmeBuilder: FC<Props> = ({ physical }) => {
  const { data } = useSWR(`/api/objects/${physical ?? ''}`, fetcher)
  const converter = new Converter()

  if (data === undefined || physical === undefined) {
    return <></>
  }

  return (
    <li className={style.readme} dangerouslySetInnerHTML={{
      __html: converter.makeHtml(data)
    }} />
  )
}

export default ReadmeBuilder
