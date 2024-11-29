import { useState } from "react";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const SearchPage = () => {
	const [activeTab, setActiveTab] = useState("movie"); // activeTab is the tab that is currently active, by default it is movie
	const [searchTerm, setSearchTerm] = useState(""); // searchTerm is the term that is searched, by default it is empty

	const [results, setResults] = useState([]); // results is an array of objects, ie each object contains the details of a movie or tv show or person , here initially it is empty
	const { setContentType } = useContentStore();

	const handleTabClick = (tab) => { // handleTabClick is a function that sets the activeTab and contentType based on the tab clicked
		setActiveTab(tab);
		tab === "movie" ? setContentType("movie") : setContentType("tv");
		setResults([]); // when the tab is changed, the results are set to empty
	};

	const handleSearch = async (e) => { // handleSearch is a function that is called when the form is submitted
		e.preventDefault(); // preventDefault is used to prevent the default action of the form, ie. to prevent the form from being submitted
		try {
			const res = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`);
			setResults(res.data.content);
		} catch (error) {
			if (error.response.status === 404) {
				toast.error("Nothing found, make sure you are searching under the right category");
			} else {
				toast.error("An error occurred, please try again later");
			}
		}
	};

	return (
		<div className='bg-black min-h-screen text-white'>
			<Navbar />
			<div className='container mx-auto px-4 py-8'>
				<div className='flex justify-center gap-3 mb-4'>
					<button
						className={`py-2 px-4 rounded ${
							activeTab === "movie" ? "bg-red-600" : "bg-gray-800" // if the tab is active then bg-red-600 else bg-gray-800
						} hover:bg-red-700`}
						onClick={() => handleTabClick("movie")}
					>
						Movies
					</button>
					<button
						className={`py-2 px-4 rounded ${
							activeTab === "tv" ? "bg-red-600" : "bg-gray-800"
						} hover:bg-red-700`}
						onClick={() => handleTabClick("tv")}
					>
						TV Shows
					</button>
					<button
						className={`py-2 px-4 rounded ${
							activeTab === "person" ? "bg-red-600" : "bg-gray-800"
						} hover:bg-red-700`}
						onClick={() => handleTabClick("person")}
					>
						Person
					</button>
				</div>

				<form className='flex gap-2 items-stretch mb-8 max-w-2xl mx-auto' onSubmit={handleSearch}> {/* onSubmit is a event handler that is called when the form is submitted */}
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={"Search for a " + activeTab}
						className='w-full p-2 rounded bg-gray-800 text-white'
					/>
					<button className='bg-red-600 hover:bg-red-700 text-white p-2 rounded'>
						<Search className='size-6' />
					</button>
				</form>

				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					{results.map((result) => {
						if (!result.poster_path && !result.profile_path) return null; // if the poster_path or profile_path is not present then return null

						return (
							<div key={result.id} className='bg-gray-800 p-4 rounded'>
								{activeTab === "person" ? ( // if the activeTab is person then show the person details
									<div className='flex flex-col items-center'>
										<img
											src={ORIGINAL_IMG_BASE_URL + result.profile_path}
											alt={result.name}
											className='max-h-96 rounded mx-auto'
										/>
										<h2 className='mt-2 text-xl font-bold'>{result.name}</h2>
									</div>
								) : ( // if the activeTab is not person then show the movie or tv show details
									<Link // Link is used to navigate to the watch page of the movie or tv show
										to={"/watch/" + result.id}
										onClick={() => {
											setContentType(activeTab);
										}}
									>
										<img
											src={ORIGINAL_IMG_BASE_URL + result.poster_path}
											alt={result.title || result.name}
											className='w-full h-auto rounded'
										/>
										<h2 className='mt-2 text-xl font-bold'>{result.title || result.name}</h2>
									</Link>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
export default SearchPage;