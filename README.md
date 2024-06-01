It’s an app for "Rick and Morty" that allows you to check information about the episodes, characters, and locations of this cartoon. This project is built using Next.js, Tailwind CSS, Radix-UI, axios, REST API, and GraphQL.

The first page, Episodes, displays a paginated list of episodes with basic information like name and air date. This list also has a "More Information" button that opens a popup with the same info, plus a list of characters. I used the fetch() method on this page with the REST API.

The second page, Characters, shows a paginated list of characters with basic information like name, species, gender, status, and image. These list items don’t have a modal window, but on this page, there is a popup for choosing filter parameters. These filters are applied only after submitting the form; if you just close the popup, your choices are saved, but the filtration doesn't work. Additionally, you can search for characters using the search bar on the page. I also used the fetch() method on this page with the REST API.

The third page, Locations, shows a paginated list of locations with basic information like name and type. This list also has a "More Information" button that opens a popup with the same info, plus a list of characters and the dimension. Here, I used axios with GraphQL. I used axios here to demonstrate my knowledge of how to use it, but I believe that for GET requests, fetch() is a little more convenient.