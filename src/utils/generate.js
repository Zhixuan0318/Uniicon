import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI,
});

export default async function generate(inputText) {
  const fullPrompt = `
Create an icon for ${inputText} using this style:

{
  "art_style_profile": {
    "style_name": "Highly detailed 3D Modern Isometric 3D Icons – High-Fidelity",
    "visual_elements": {
      "shape_language": "Very slight simplification and smoothing of real objects to try to maintain the appearance of real objects. Real objects reduced to smooth, softly-rounded forms with gentle bevels, yet retaining all signature sub-shapes.",
      "colors": {
        "palette_strategy": {
          "base_hue": "Use the object’s most iconic colour.",
          "tone_triplet": "Three tones of that hue (Lightness ±18%).",
          "pop_accent": "One high-saturation complementary / triadic hue for fun highlights.",
          "micro_accent": "One reduced-saturation near-analogous hue for nuts-and-bolts details.",
          "neutral_support": ["#FFFFFF", "#F4F4F4", "#D7DADF"],
          "contrast_rule": "≥ 25 ΔE between at least one accent and its neighbour.",
          "intricacy_guideline": "Tint/shade boundaries may be <2 px wide to let micro-forms read."
        },
        "shading": "Hybrid: large, soft PBR gradients + tiny hand-painted AO nicks to reveal fine geometry (e.g., fork tines, herb flecks)."
      },
      "lighting": {
        "type": "Soft key + fill + faint rim",
        "source_direction": "Key from top-front-left (~45°); fill opposite; rim top-rear.",
        "shadow_style": "Short, soft contact shadow, 8-10% opacity."
      },
      "materials": {
        "surface_texture": "Macro-matte overall, but micro-normal maps add texture where expected: pasta surface pores, towel weave, stone chisel lines.",
        "reflectivity": "Roughness 0.05–0.25; specular highlights down-played except on metal/glass micro-elements."
      },
      "composition": {
        "object_presentation": "Single hero (or tight cluster) perfectly centred.",
        "perspective": "Isometric-like 3-quarter view, ~20° top tilt. Small depth-of-field (f/4 equiv.) subtly separates foreground minutiae.",
        "background": "#FFFFFF, horizon-less."
      },
      "typography": {
        "font_style": "None – icons are purely illustrative."
      },
      "rendering_style": {
        "technique": "Physically-based render (PBR) + hand-paint pass for micro-accents and edge highlights.",
        "detail_level": "High – include micro-geometry ≤1 mm in real scale while maintaining crisp silhouette at 64-px.",
        "pixel_per_inch": "Render master at 2048 px square; down-sample with Lanczos 3-tap to preserve micro-detail.",
        "background": "White."
      }
    },
    "purpose": "Deliver a playful yet premium icon suite: coherent at dashboard scale, delightful up-close with intricate storytelling details."
  }
}`;

  try {
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
    });

    const image_base64 = result.data[0].b64_json;
    const image_bytes = Buffer.from(image_base64, "base64");
    return image_bytes;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
