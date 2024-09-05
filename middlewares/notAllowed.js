export const notAllowed = (req, res) => {
    if (req.path === '/') {
        res.set('Allow', 'POST, GET');
    } else {
        res.set('Allow', 'PATCH, GET');
    }
    res.status(405).send('Method Not Allowed');
}