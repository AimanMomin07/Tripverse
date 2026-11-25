import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  amount:number
  onConfirm: (splits:{name:string, share:number}[])=>void
  onClose: ()=>void
}

export default function GroupSplit({amount, onConfirm, onClose}:Props){
  const [count, setCount] = useState(2)
  const [names, setNames] = useState<string[]>(['',''])
  const split = useMemo(()=> {
    const per = Math.round((amount/count))
    return Array.from({length:count}).map((_,i)=>({name:names[i]||`Person ${i+1}`, share: per}))
  }, [amount, count, names])

  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <motion.div className='bg-gradient-to-br from-black/70 to-gray-900 glass p-6 rounded-xl w-full max-w-md'>
          <h3 className='text-xl font-semibold mb-3' style={{color:'var(--gold)'}}>Group Split Payment</h3>
          <div className='mb-3'>
            <label className='text-sm text-gray-400'>Group size</label>
            <input type='number' min={1} value={count} onChange={(e)=>{ const v = Math.max(1, Number(e.target.value)); setCount(v); setNames(n=>{ const copy = [...n]; while(copy.length<v) copy.push(''); return copy.slice(0,v) })}} className='ml-2 p-2 rounded bg-white/5'/>
          </div>
          <div className='space-y-2 max-h-40 overflow-auto mb-3'>
            {Array.from({length:count}).map((_,i)=>(
              <div key={i} className='flex gap-2'>
                <input placeholder={`Person ${i+1}`} value={names[i]||''} onChange={(e)=> setNames(ns=> { const c=[...ns]; c[i]=e.target.value; return c })} className='flex-1 p-2 rounded bg-white/5'/>
                <div className='w-28 p-2 rounded text-right bg-white/5'>₹{Math.round(amount/count)}</div>
              </div>
            ))}
          </div>
          <div className='flex justify-end gap-2'>
            <button onClick={onClose} className='btn'>Cancel</button>
            <button onClick={()=> onConfirm(Array.from({length:count}).map((_,i)=>({name:names[i]||`Person ${i+1}`, share: Math.round(amount/count)})))} className='btn bg-indigo-600 text-white'>Confirm Split</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
