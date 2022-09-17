export default function auth({ next, router }) {
  if (!localStorage.getItem('auth')) {
    return router.push({ name: 'signin' });
  }

  return next();
}