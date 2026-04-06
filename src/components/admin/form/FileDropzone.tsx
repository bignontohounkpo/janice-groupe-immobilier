"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileDropzoneProps {
  readonly onUploadComplete: (url: string) => void;
}

export function FileDropzone({ onUploadComplete }: FileDropzoneProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    
    // Filtre pour ne garder que les images de moins de 5MB
    const imageFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Fichier ignoré",
          description: `${file.name} n'est pas une image.`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 5 Mo.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (imageFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    try {
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.url) {
          onUploadComplete(data.url);
        } else {
          toast({
            title: "Erreur d'upload",
            description: data.error || `Erreur lors de l'envoi de ${file.name}`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur serveur",
        description: "Une erreur est survenue lors de la communication avec le serveur.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Zone de dépôt de fichiers"
      className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[200px] ${
        isDragging
          ? "border-[#1A5276] bg-[#1A5276]/5 scale-[1.01]"
          : "border-border hover:border-[#1A5276]/50 hover:bg-muted/30"
      } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3 text-center">
        {isUploading ? (
          <>
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#1A5276] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Upload size={16} className="text-[#1A5276]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-[#1A5276]">Chargement en cours...</p>
              <p className="text-xs text-muted-foreground italic">Veuillez patienter pendant l'upload...</p>
            </div>
          </>
        ) : (
          <>
            <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-[#1A5276] text-white' : 'bg-muted text-muted-foreground group-hover:bg-[#1A5276]/10'}`}>
              <Upload size={32} />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg text-foreground">
                Cliquez ou glissez-déposez
              </p>
              <p className="text-sm text-muted-foreground">
                Sélectionnez vos meilleures photos immobilières (JPG, PNG, WebP)
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                Taille maximale : 5 Mo par image
              </p>
            </div>
          </>
        )}
      </div>

      {isDragging && (
        <div className="absolute inset-2 border-2 border-dashed border-[#1A5276] rounded-xl pointer-events-none animate-pulse" />
      )}
    </div>
  );
}
