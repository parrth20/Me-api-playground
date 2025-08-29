INSERT INTO profiles (name, email, headline, education, skills, projects, links, bio)
VALUES (
  'Parth',
  'parthbandwal3@gmail.com',
  'Software Engineer - Backend & ML enthusiast',
  '[{"degree":"B.Tech","major":"Information Technology","school":"IIIT Lucknow","year":2023}]'::jsonb,
  '["python","flask","sql","postgres","docker","git,etc"]'::jsonb,
  '[
     {"title":"Me-API Playground","description":"Candidate profile API with search/filter","links":["https://github.com/parth/me-api-playground"]},
     {"title":"Perceptron Lab","description":"Perceptron implemented for classification","links":["https://github.com/parth/perceptron"]}
  ]'::jsonb,
  '{"github":"https://github.com/parrth20","linkedin":"https://linkedin.com/in/parrth20","portfolio":"https://parth-portfolio-app.vercel.app/"}'::jsonb,
  'I build small web services and enjoy learning ML.'
);
