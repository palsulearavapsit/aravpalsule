export type Project = {
  number: string
  title: string
  category: string
  description: string
  details: string
  tags: string[]
  art: string
  githubLinks?: { label: string; url: string }[]
}

export const projects: Project[] = [
  { number: '01', title: 'Radiator Routes', category: 'Agentic AI / Full-Stack', description: 'A conversational travel planner that turns a loose idea into a trip that can actually work.', details: 'Built specialized LangGraph agents for travel planning, itinerary validation across budget, timing and geography, and an LLM repair loop. Group options are compared with Least Misery scoring.', tags: ['LangGraph', 'React', 'TypeScript', 'Supabase'], art: 'routes', githubLinks: [{ label: 'Radiator Routes on GitHub', url: 'https://github.com/palsulearavapsit/radiator-routes' }] },
  { number: '02', title: 'CrackX', category: 'Computer Vision', description: 'Road condition monitoring that detects and localizes cracks and potholes from image and video.', details: 'YOLO-based damage detection, severity assessment and reporting workflows connect model output to maintenance planning.', tags: ['Python', 'YOLO', 'Computer Vision'], art: 'crack', githubLinks: [{ label: 'CrackX on GitHub', url: 'https://github.com/palsulearavapsit/Road-Condition-Management-System' }] },
  { number: '03', title: 'Dengue Forecast', category: 'Machine Learning', description: 'A forecasting pipeline combining historical cases, weather, geography and temporal features.', details: 'Compared Random Forest, Extra Trees, HistGradientBoosting and Ridge with chronological holdout and rolling-window validation using MAE, RMSE and SMAPE.', tags: ['Python', 'Pandas', 'Forecasting'], art: 'forecast', githubLinks: [{ label: 'Dengue Prediction on GitHub', url: 'https://github.com/palsulearavapsit/dengue-prediction' }] },
  { number: '04', title: 'Cinerec AI', category: 'Generative AI / Video', description: 'An AI-assisted pipeline that finds meaningful scenes and shapes them into a music-matched highlight reel.', details: 'Combines scene emotion classification, importance ranking, semantic music retrieval, timestamp generation and automated clip composition.', tags: ['DistilBERT', 'FFmpeg', 'MoviePy'], art: 'cinerec', githubLinks: [{ label: 'CineRec AI on GitHub', url: 'https://github.com/palsulearavapsit/cine-rec-ai' }, { label: 'CineRec AI ML models', url: 'https://github.com/palsulearavapsit/ml-models-for-cine-rec-ai' }] },
  { number: '05', title: 'Sphere AI', category: 'Data Analytics', description: 'An educational analytics platform for understanding student performance and engagement.', details: 'A Flask dashboard built around exploratory analysis, data processing and academic KPI reporting.', tags: ['Flask', 'EDA', 'Visualization'], art: 'sphere', githubLinks: [{ label: 'Physics Sphere AI Classroom on GitHub', url: 'https://github.com/palsulearavapsit/Physics-Sphere-AI-Classroom' }] },
  { number: '06', title: 'The Review Room', category: 'NLP / Data Analytics', description: 'A text analytics exploration of large-scale customer feedback.', details: 'Text processing, sentiment analysis, topic exploration and review retrieval help turn unstructured opinions into useful patterns.', tags: ['Python', 'NLP', 'Sentiment'], art: 'review', githubLinks: [{ label: 'The Review Room on GitHub', url: 'https://github.com/palsulearavapsit/nlp' }] },
]
