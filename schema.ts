// packages/wtoon-core/schema.ts
// .wtoon Format Spec v1.0 — OPEN SPEC (MIT)
// GitHub: ai-nime/wtoon-spec

export interface WtoonFile {
  meta: {
    version: "1.0"
    title: string
    author: string
    art_form: "manga" | "manhwa" | "webtoon" | "comic" | "illustration"
    created_at: string   // ISO 8601
    updated_at: string
    language: string     // "en" | "ja" | "ko" | "zh"
    ai_nime_project_id?: string
  }
  characters: WtoonCharacter[]
  chapters: WtoonChapter[]
}

export interface WtoonCharacter {
  id: string
  name: string
  description: string
  reference_image: string   // "assets/chars/hero.png" — relative in ZIP
  geometry_tokens?: string
  expressions: Record<string, string>  // "angry" → "assets/chars/hero_angry.png"
  outfits: Record<string, string>
}

export interface WtoonChapter {
  id: string
  title: string
  order: number
  pages: WtoonPage[]
}

export interface WtoonPage {
  id: string
  order: number
  layout: "vertical_strip" | "grid_2x2" | "grid_3x3" | "custom"
  width: number   // base: 800
  panels: WtoonPanel[]
}

export interface WtoonPanel {
  id: string
  order: number
  image: string       // "assets/panels/p001.png"
  video?: string      // "assets/panels/p001.mp4"
  width: number
  height: number
  characters: Array<{
    id: string
    expression?: string
    outfit?: string
    x: number        // 0-1 normalized
    y: number
    scale: number
    flip_x?: boolean
  }>
  bubbles: WtoonBubble[]
  effects: WtoonEffect[]
  ai_meta?: {
    prompt: string
    model: string
    qa_score?: number
    generated_at: string
  }
}

export interface WtoonBubble {
  id: string
  text: string
  shape: "speech" | "shout" | "whisper" | "thought" | "narration" | "sfx"
  x: number          // 0-1 normalized relative to panel
  y: number
  width: number
  height: number
  tail?: { x: number; y: number }  // normalized, where tail points
  style: {
    font_family: string
    font_size: number
    font_weight: "normal" | "bold"
    color: string
    bg_color: string
    border_color: string
    border_width: number
    opacity: number
  }
}

export type WtoonEffect =
  | { type: "zoom_in" | "zoom_out"; intensity: number }
  | { type: "shake"; direction: "h" | "v"; intensity: number }
  | { type: "speed_lines"; direction: number; density: number }
  | { type: "focus_lines" }
  | { type: "blur"; radius: number }
  | { type: "color_flash"; color: string }
  | { type: "fade_in" | "fade_out"; duration: number }

// FILE FORMAT: .wtoon = ZIP containing:
// episode.json     (this schema)
// assets/panels/   (panel PNGs/videos)
// assets/chars/    (character reference images)
// assets/bgs/      (background images)
// thumbnail.png    (400x225 episode preview)
// LICENSE          (creator's license choice)
