![Site home page](images/home-page-short.png)

[![Netlify Status](https://api.netlify.com/api/v1/badges/d2459447-19e0-4037-8fd1-12cbbf173fa0/deploy-status)](https://app.netlify.com/projects/breakfastquest/deploys)

> [!WARNING]
> Work in progress; this site may be publicly available, but it's not ready for prime time yet.

Netlify project: [https://breakfastquest.netlify.app/](https://breakfastquest.netlify.app/).
Pixelarity Template: [Editorial](https://pixelarity.com/editorial)

## Map

With Google Maps, you can feed it a data file with latitude and longitude values as well as a location name, pictures, etc.
Recommend adding long and lat values to post front matter and generating the file during the build process. 
Map page loads the data file from the server and passes it to the Google Maps API.

**Generating Latitude & Longitude**

Use the `geocoder` command in the terminal to calculate latitude and longitude from an address

``` shell
geocoder "<restaurant_address>"
```

**Home Page Image Dimensions**

+ 416 x 256

## Indexing

`idxIgnore: true` keeps a page out of the index

## Contact Form

https://app.web3forms.com/dashboard

## Tasks

- [x] All pages (not only posts) content in the index
- [x] Home Page content
- [x] About page content
- [x] Post allow multiple visit dates
- [x] Application icon
- [x] FAQ
  - [x] from JSON Data file
  - [x] Pagination
- [X] Contact form submission to...where?
- [ ] Articles by Visit Date (with empty checking) for Pagination
- [ ] Reviews by Visit Date (with empty checking) for Pagination
- [ ] Higher resolution breakfast plate image
- [ ] 
- [ ] 
- [ ] 

## Post Launch

- [ ] Business cards
- [ ] Image Gallery
- [ ] Newsletter
  - [ ] https://buttondown.com/
  - [ ] Newsletter sign-up in sidebar
  - [ ] Delete About menu item
- [ ] Reviews by state or city?
- [ ] Home Page: Top 10 popular posts listing
- [ ] Most popular articles page
- [ ] Site page content/stats
- [ ] Rating
- [ ] Locations page: Make PWA and cache locations data locally
- [ ] Display author on page
- [ ] 
- [ ] 

## Scott Tasks

- [ ] 
- [ ] 
- [ ] 

## Thinking List

- [ ] Calendar view? Could be fun.
- [ ] Menus
- [ ] News
- [ ] Recipes?  Perhaps from the restaurants?
- [ ] 
- [ ] 
- [ ] 
