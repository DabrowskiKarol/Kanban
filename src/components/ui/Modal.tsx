import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { motion } from 'framer-motion'

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-[#032147]/20 backdrop-blur-md" />
      <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            as={motion.div}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className="surface-glass w-full max-w-2xl p-6 sm:p-8"
          >
            <div className="mb-6">
              <p className="label-text">Workspace action</p>
              <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
            </div>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
