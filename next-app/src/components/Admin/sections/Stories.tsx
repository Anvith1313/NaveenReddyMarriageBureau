'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { AdminStory } from '../adminTypes'

export default function Stories({ showToast }: SectionProps) {
  const [stories, setStories] = useState<AdminStory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'stories'), where('status', '==', 'pending')))
      const arr: AdminStory[] = []
      snap.forEach(d => arr.push({ ...d.data(), docId: d.id } as AdminStory))
      arr.sort((a, b) => (b.ts ?? '').localeCompare(a.ts ?? ''))
      setStories(arr)
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
    setLoading(false)
  }

  async function approveStory(docId: string) {
    try {
      await updateDoc(doc(db, 'stories', docId), { status: 'approved', approvedAt: serverTimestamp() })
      setStories(s => s.filter(x => x.docId !== docId))
      showToast('✅ Story published')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  async function dismissStory(docId: string) {
    try {
      await updateDoc(doc(db, 'stories', docId), { status: 'dismissed', dismissedAt: serverTimestamp() })
      setStories(s => s.filter(x => x.docId !== docId))
      showToast('Story dismissed')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  if (loading) return <div className={s.emptyState}>Loading stories…</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'var(--a-muted)' }}>
          {stories.length} pending stor{stories.length !== 1 ? 'ies' : 'y'}
        </span>
        <button className={s.actBtn} onClick={load}>↻ Refresh</button>
      </div>

      {stories.length === 0 ? (
        <div className={s.emptyState}>No pending stories to review.</div>
      ) : (
        <div>
          {stories.map(story => (
            <div key={story.docId} className={s.storyCard}>
              <div className={s.storyNames}>{story.names}</div>
              <div className={s.storyMeta}>
                Married · {story.year}{story.location ? ` · ${story.location}` : ''}
              </div>
              <div className={s.storyText}>&quot;{story.text}&quot;</div>
              {story.contact && (
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.82rem', color: 'var(--a-muted)', marginBottom: '0.3rem' }}>
                  Contact: {story.contact}
                </div>
              )}
              <div className={s.storySubmitted}>
                {story.ts ? new Date(story.ts).toLocaleString('en-IN') : '—'} · by {story.submittedBy ?? 'unknown'}
              </div>
              <div className={s.storyActions}>
                <button className={`${s.actBtn} ${s.actBtnGrn}`} onClick={() => approveStory(story.docId)}>✓ Publish</button>
                <button className={`${s.actBtn} ${s.actBtnDanger}`} onClick={() => dismissStory(story.docId)}>✕ Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
