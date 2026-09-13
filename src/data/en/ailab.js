'use strict';

/* =====================================================================
   AI LAB (EN)
   ---------------------------------------------------------------------
   English mirror of src/data/ailab.js. The framing is deliberate: this
   is not "look what AI made", it is "look what a designer makes using
   AI as a tool". That is why the pipeline comes before the gallery.
   The method is the content.
   ===================================================================== */

const intro =
  'A space for visual experimentation, art direction and exploring creative possibilities with artificial intelligence. The model generates. Direction decides what is any good.';

/* --------------------------------------------------------------------
   PIPELINE: the six steps between an idea and an approved image.
   Method content, written and verifiable. Each step has a `sample`
   shown in the interactive panel.
   -------------------------------------------------------------------- */
const pipeline = [
  {
    n: '01',
    label: 'Concept',
    title: 'The idea exists before the prompt',
    text: 'Before opening any tool: what this image has to communicate, to whom, and where it lands in the campaign. Without that, the result is decoration.',
    sample: { kind: 'note', label: 'Brief', value: 'Visual territory, audience, channel, format and what the image has to prove.' },
  },
  {
    n: '02',
    label: 'Prompt',
    title: 'The prompt is a brief, not magic',
    text: 'I describe what I would describe to a photographer: subject, framing, lens, light, palette, texture and period reference. The more specific the brief, the fewer rounds until something usable.',
    sample: {
      kind: 'prompt',
      label: 'Structure',
      value: '[subject] · [action] · [framing and lens] · [quality of light] · [palette] · [texture and material] · [direction reference] · [aspect ratio]',
    },
  },
  {
    n: '03',
    label: 'Generation',
    title: 'Volume is raw material, not a result',
    text: 'Several rounds, controlled variations of one parameter at a time. The goal is not to get it right first try, it is to map the territory until you know where the right image is.',
    sample: { kind: 'note', label: 'Method', value: 'One variable per round: light, then framing, then palette.' },
  },
  {
    n: '04',
    label: 'Curation',
    title: 'The part the tool does not do',
    text: 'Out of dozens of outputs, few survive. The criteria are the same as in a photo edit: readability, hierarchy, coherence with the brand, and whether it holds up in a real piece.',
    sample: { kind: 'note', label: 'Criteria', value: 'Does it read in 1 second? Does it hold the brand? Does it survive crop, text and application?' },
  },
  {
    n: '05',
    label: 'Art direction',
    title: "Where it becomes a designer's job",
    text: 'Treatment, color correction, composition, typography, retouching hands and details, adjusting proportion for the final format. This is where the image stops looking generated.',
    sample: { kind: 'note', label: 'Tools', value: 'Photoshop, Illustrator, After Effects, upscaling and manual retouching.' },
  },
  {
    n: '06',
    label: 'Result',
    title: 'A piece, not an experiment',
    text: 'The final deliverable is the applied piece: post, campaign, banner, video frame. If where the image came from is the most interesting thing about it, the work is not finished.',
    sample: { kind: 'note', label: 'Deliverable', value: "The piece applied in the channel, inside the brand's visual system." },
  },
];

/* --------------------------------------------------------------------
   EXPERIMENTS: structure ready, images to be uploaded.
   `cover: null` renders a marked slot instead of a broken image.
   -------------------------------------------------------------------- */
const experiments = [
  { slug: 'personagens', title: 'Characters', kind: 'Character design', text: 'Building a character that stays consistent across poses, angles and scenes.', cover: null },
  { slug: 'campanhas', title: 'Campaigns', kind: 'Campaign', text: 'Campaign pieces generated and directed inside a closed visual system.', cover: null },
  { slug: 'fotografia', title: 'Photography', kind: 'Photography', text: 'Synthetic photographic direction: light, lens and framing defined in the brief.', cover: null },
  { slug: 'concept-art', title: 'Concept art', kind: 'Concept', text: 'Exploring visual territory before settling on a campaign direction.', cover: null },
  { slug: 'cenarios', title: 'Environments', kind: 'Environment', text: 'Settings and spaces as a backdrop for product and communication.', cover: null },
  { slug: 'produtos', title: 'Products', kind: 'Product', text: 'Product in context, without depending on a studio or a stock library.', cover: null },
  { slug: 'video', title: 'Video', kind: 'Motion', text: 'Movement out of a still image, for teasers and short-form content.', cover: null },
  { slug: 'exploracoes', title: 'Explorations', kind: 'Studies', text: 'Free studies: texture, material, typography and form with no commercial destination.', cover: null },
];

module.exports = { intro: intro, pipeline: pipeline, experiments: experiments };
