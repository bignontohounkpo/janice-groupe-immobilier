import { AlertTriangle, Loader2 } from "lucide-react"

interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  isLoading?: boolean
}

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false
}: DeleteConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#FAD7A0]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-[#F39C12]" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-lg font-medium text-foreground bg-white border border-input hover:bg-muted transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-lg font-medium text-white bg-[#E74C3C] hover:bg-[#C0392B] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
