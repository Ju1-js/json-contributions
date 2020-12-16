Given a Github username and a year, return a JSON object with their contribution chart data. The function simply requests the user's profile page and scrapes the contribution chart data. Based on the work of [@jasonlong](https://github.com/jasonlong)

**Note: this is very alpha. No error checking at all.**

```
/api/user?username=<username>&year=<year>
```

Example: https://json-contributions-five.vercel.app/api/user?username=martinwoodward&year=2020

#### Development

I've been using `vercel` for local dev. To load up a local server: `vercel dev` after running `npm install`
