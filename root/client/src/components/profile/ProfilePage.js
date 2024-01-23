import React, { useEffect, useState } from "react";
import RecentMatches from "../common/RecentMatches";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faBomb,
  faBolt,
  faClock,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import { playerUsername } from "../../services/auth";

const ProfilePage = () => {
  const [infos, setInfos] = useState(null);

  const getInfos = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: process.env.REACT_APP_API + "/api/user/" + playerUsername,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        let userData = {
          username: response.data.username,
          bio: response.data.bio,
          matches: response.data.matches,
          wins: response.data.wins,
          losses: response.data.losses,
          draws: response.data.draws,
          category: {
            Bullet: {
              icon: faBomb,
              elo: response.data.bulletElo,
            },
            Blitz: {
              icon: faBolt,
              elo: response.data.blitzElo,
            },
            Rapid: {
              icon: faClock,
              elo: response.data.rapidElo,
            },
            Puzzle: {
              icon: faPuzzlePiece,
              elo: response.data.puzzleElo,
            },
          },
        };
        setInfos(userData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getInfos();
  }, []);

  return (
    <div className="h-3/4 bg-white dark:text-white dark:bg-gray-800 flex md:flex-row flex-col justify-center gap-6 p-6 md:p-8 pt-20 md:mt-16">
      <div>
        {infos && (
          <div className="md:w-fit w-full h-fit md:p-8 p-4 rounded-lg dark:bg-gray-700 shadow-[0_1px_5px_rgb(0,0,0,0.15)] flex md:flex-col items-center justify-center gap-3 md:gap-0 md:justify-start">
            <img
              className="hidden md:inline w-32 h-32 rounded-full mb-4 bg-gray-100"
              src="data:image/jpeg;base64,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"
              alt="Profile"
              width="150px"
              height="150px"
            />
            <div className="hidden md:inline font-medium text-3xl mb-1">{infos.username}</div>
            
            <div className="md:hidden flex flex-col items-center">
              <img
                className="w-32 h-32 rounded-full mb-4 bg-gray-100"
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBISEhEVEhISEhEREhIRERISEhERERERGBQZGRgUGBgcIS4lHB4rHxgYJjgmKy8xNTU1GiRIQDtAPy40NTEBDAwMEA8QGhISGDEhGB0xNDQxNDExNDQ0NDQ0MTQ0ND80PzQ0Pz8/MTQ0MTQ0MTExPzExMTQxNDExMTExMTExMf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAEAAIDBQYBB//EADYQAAIBAwIEAwcCBgIDAAAAAAECAAMEEQUhEjFBURNhcQYiMlKBkaEUQhUjM2JysVPwJEPB/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDAAQF/8QAIREBAQACAwEAAgMBAAAAAAAAAAECEQMSITEyQRMiUWH/2gAMAwEAAhEDEQA/AKzWFxWf1gaHBh2vf1m84ADJ1ZY0H5SwVsynotuJaUm2EnTYre1PKT6mM0nHdTBbQ5Ih14n8tv8AEye/VP083uB7p7jMVepm1TuG2kl0mA/qZDSXioAH9r/aXkQs9V63RGAfOFJUymfOE6zp1OnTVlySQPvA7Ki7IwAbn2jTTO+IZE1U5+snFq/yn7SL9NU3yjfYzeF9WKVDgekcXzGUqZKj4uXaP4PI/aZtIyY3MkNFux+0ctu5/YZh0qKh96ae0QNbVNuaiVL6NVY7ATQWNEpRqK3SmeUNNiitlzbg+n4m/sLlRb0yeoUCefWLE0AAdpsKVIm1oEdCshn9U/TRJynQwiQAgeg/1OeEIpa4x85zMf4KwRiwfn7szaStGlp2t8Jxz6Qa3Db8ZyYROZ5CxzJXAkDEDrBabTuYoziEUG20wvtCP5x9BKzMs/aFf5pPlKlTtLJiqEs6B5SqtzLO3i0Yu9O3YS6uaeUP+JlRpie8Jp2pe79JHK6yVxm48lvqfvOOxMEsMeFUz0MttXXhq1B/cZT6a6g1FY4B5Tp+4xDKXawpU3ZE4htz+ksbWp4ZJwCD0xOiqhQBN8YESJJXKxfDCWfBx1GkMcSY7nEP0/XbNVcVEU5G2wzM/VpZGOhgD2luPiqNmHHLZM8eq9q6nbZPCoxnbaQtq1DHwDPpKlKFp87H7yXw7Pu35lNkEPqydFA+gg7agDyP0nOGz7MY9DZj9h/M2wp9jdoSeNsQ+wcN4yjJzTOIEtxar8NOH22uUaYPBTGTzJm20gLSqZNI+622dsTdaYQLemHIG3XaZtfagIPcpoAemBAdT9oqlUAYCgcsbSV9UlbNtRA6jtznBqQ6uv3nniXFV+sl3UbkmBtVvxqY/wCRPvIjqNPI4qi8+886uKjDkTIhUcY94wyB+3p9zqlHG1QCV/8AFaYOfEmCeqx6mcLnuYWbatq1PPx5zBqmsUx+6Y8ue8icnvN1222y/jqd4pit4oekba99pv6iY6jeVHSXftCATTMoOLcxqUTRMs7dt5UoeUsbdtxBYO2p0Ygus1fD/qY3SawDrNgtQYHnObl+r4fHl3tKuLqr2zn8TLVviPcma/2xGLqp5gTJ3GAxnVj+MQyvq59nt0cHmG/EvETaZnRKhDkdDNKr42kc566eK7jjjEqL638RcjYiW7nMCqrFx8NljKz5RhsdvrFhv+mai0tqb/GmYSdKo9o15JEv4WPAneEzWnSqPYyCpo1PmpIgnLAvDWbVT3P5k1MektX0d/2kTn8IqDqI0zlD+PKK/hhNC3AwW5dBCFtQm79JKPe9OkXLIccKS49I2sm2THkYg15W4RucQ4xTLWMBVW3M4gkXjqf3COSsvLildeOap5zAnVE6RAJhEjYSQyFzMGiwJ2MzOQtqLjVX41Q9pUOd8Q8vxIvXYSuqfEY1gbS02htF4AkJptBsdL/TanvCbK2qZVZgrB8ETYWVTKrgyHJNrYZa8ZH2yX/yD5pMncLvnvNl7WpmoD/bMhe7SvHf6o5T+1Saav8AMUjviaUOAN5RWA2UgdZcV14sRc1eEnr45bxrMT0jqFMR7yWVXqFHKwqndGDsMxIuJOzZsdrOlWJi8TeCU2j2bESz0+xFStgQapcnvOXB2gpO0OJKhrVuI79DJEqgDnI1QGKtbbbSuiXxPkc8zOa5dlm4QcAdZbVHKqZm7w8TGXxjn5crTbdQebER1MjxAMk7jeMp0mIJ6Yj7VPfTPeW/SMrSHGBiMZon93lvImaTUd495G/OaT2asKb06lWqCVQ7CSe1NGilqj00CFz9cQzEtvrK/SckXiL8zTsOg2NtmygkFce9JLA7Y7EyO5XDmGs4pkyNIBJEMUVlbPuJrNKq+5MfQO4ml0h9omUUw+gvak7ofLExuoTYe1nwK3baYq5eHD4TPe1ppjjhUdcyzqK3SU/szTNSsFxsu5mtr01BI85PluluCK2kp6x/ATJ2QSA1cSFtrp0QpzvhwlEBGcznDB6OpEKpOOe8npYOZDWxNoa6wyIK642hdB84E5dUvehkLQQjw5Ajkp7mSNT7iHdDW1desCu0zlfYkTY3tp/LJXn2mMuch9+86OO7cfLjdi2T+XI7FffXPKFIeKkcQOg/C652l78RkXj9xyg7n7czJHcdOUHrOAJJVq9CvGp2bBAG4nOxgntbcu9OkCMEDOBygljcKKHD4iqSc89xCqmoUioVmRiB1OY0y8DTJ5bt+Ipo/wBbQ/sih22gdsvuuezRXi7g+U7bcqg9DOVznHpDShI9DOGdSKMH0ekvtNfBEz9E8pcWD7xMlMPqf2pTNDI6HMwLjODPRdTTjoOPKedFGLgAHrDh8DP60nspRK8b8pbvX3Oeci0i1NO3Uke85j61qTic3Jd10cU1ije5EHdyFLY5dJK1DHOTUypHCR0xFitulA2tVAQop7ty7R9DWskhhwtnHlO6rpTMVKD4fhO8bZWaU0Zq3vVCMKo3x5yk0jbltZW9ySCemIncHnmN0YhldWG4+HvJalEiLZNqbtiJKvDicqaiB8W0aw/EpLmnUZuNQSAT7vMn6RsZE8rR51hAfd3POE0b/iwTnB8pTafYOSzspGxCqdjk+U01vbItNQw34fzNlocbRVEcYwP3DEq732RdjnxEUncbiHWaEsAvTlDW0uoxJ4iT03MbDLRM5tSr7LYphTXQd8ERo9l6YIJrg49JeDQ2PMn7xyaB/wBzGuVL1gBtFt8b1s/WB1NNtOXiEnpLptDwMnMAraaOLAEXdG6V7aNb9Kg3/EttM0ezUe/4dQ+eJC+mkdjIGsiOn+4ZaG40P8Nsf+Ol9hFM7+mPn+Yo2624rkQrUI+ZD+JE+es0g0tA4YnJG0JbSKZ/bGvJCzjrFvEgM2S6RTz8IkyaTT+QRP5IP8bKW7+UsrZ+Wx+00dHSaXyCH22n0wR7oi3kh8ePSoamXpvjkVPQzD2Fq4rEFSRxH/c9kW2QLgKOUpq9mgYngHPoIk5dGuEqqqNimg6CD/qBDL+nnlKWpRIJxEvt2rJJBjkNIGTHKCKXBhVN/mm0J6VG68u0l4VbcqufSQgdpIiERd0dIm2bYAekKallPORMu+8MekxQEAzboyKOquMwqws6eMkb885kF4hXY7GT22ceWJrbonUVUdV+FR6mVtxVMmrPjnK+s/b0mx3+28i60ZhxAy8bUOHYLKnRrfgp5PNt4RUj9tJ2SiRqT/IIxdScnHCBBE6ziZzD2rdYsWrFhAnTfMnxGNB2rdYiYyNzmTGRtDMguKHhPlFH4ijdg6rkWuCDtJjTUdJC1bGI96nLEWxQ3wlJ2EmSmO0h8aLx/OKMGqgktPnAErQmhV3EFGrPoZUXTjJllUfCymfDNAGjqlAOu0qa1lgnzmkt0GOU5WtlbpMFY+rYnoZGlnvuwmjubI9BK2rblTyh2MqFbWSLRxJA2Oc6KueWPrAbsivUWmhbBON8Tula/SdN+FSuxU85y6qcQwZmrvTcsSm2efSNjAuQ7WNUp1agWmpY9ccocmEQDHSV9tZpSwQPexuZJUuv25jWBMkF6+V2BzIdNs2dhnocw3gD4GDLawtMcpiW+iVTA27Yg1V+w3hzMFBkDYPSJRDUVJkmCDEQF6yPgVv3ETMKBzOMJGm3pHu4mE3gzInwImdugjGcdcwyBa7lYpFxj5YodBtaVsbThbaDVXQf+z8xn6pOXEI2h2kapvF48YVXnxgTnjUB8VTB8sQdW7CadTMMoPuJWi9oftdj57Tq6hTG4JaCwd7X1zUwuJSvXwTvE1+amBjAkdS3zneIfGf6urC6Urud4eGHSYljUpnIMtbDWFOA2xmbKNCfPEFqUVPMR9O6QjmJxm3hJrStvbVQOUpK9Jx8P+5rKqcQ3lNd2pByOUMBScdYbcIzIXoVGyTsfKWlR8Qd6vaNNQKqrgVAN5FRpljk/mWLI1Qwu308jdodtIVgncCWfiKg57iCVHVRhecioUyTlzkRbkbqNWr4gJEQUgfEoHmZEaqKCFEor+5YNgEj6zY47Lbpc1UHM1E+8g416Ov+5mqtwwVs5OZELlwg4B9zD1Ds1XjqNjUUR3HTOM1QPSY6s9RgDn3p1Kx5Hc9+k3VuzcCrZgb16mfJYO17Z5wKlQn/ABAmYSoSDGsuN8fYwzELWq/V23zVPxFMlw/3GKHrQ2io1GJ3Y/UyfxMfuMqTcEHYTovW7fmU6l7LGtV/uY+WTI6dNWzzzA/1HXEctyflm6t2GW61EJB3HSXVhRZ9zmC6Uxf4kzNLbUwq8pLPxbCbLh4RttGC4I2MIqJkQRqe8javpOtYNtIzbpv38o0UpGxIi7Np1qdRf6bn0ktrqVamQHGQJCtUgwhGBEMyLcWgtrpagGDv1EfVp5lBb+63ErYxDqV8xbflDKTqfUsUbPeDDSesulwRmCXFwBnEbsGggtkTpvB7ipnblIbq6O8BNwzcoLRxxEMQvmZEa7McATtKizc4SKIXlFtPoylSPWDarp/EMrzxLFHk68MOOVhbjLHntQOhIYHEie6wMBZrtatOIEqBMpVocJM6sbLHJnuVGLokfDI1rntiOCR3BH1E+1Qio+++J0VX7yXgiCQ9W7U39VU8oo/gim03aoAk7wy7FrT+URwoIP2iU0VQ8MkppnEu/AT5RH0aKfKILPBxnqz0O3Cpk/eWrNBaOAoxyxHFpwZ5eu7CagpsYgrRwfvOtiSsVMRSZ004g2Ii47xdDEL0ZCr8O0neqO8haop6iNGqelUHeSGtA0t+LkxwIl22yciMnte0Lr3cQC6uRvg79oMlQiRVHVd23PlMM9ccM/kJPQpqnaVjXpJwAcR6eIehmGRbtXUdZC90vTnAxSfqJ1EGcHAM1NoUtwe0mV8+UGBxtzkqjPcQQKkrjKkdxMvfoASMTSV0bGzSgv6ZJMvx31y82tKoiLElFEx60DOmOTYfEWISbcxfpzDuCGihXgRTbjIv1JnDcnvK88Pn94gy9vzH2Glktz5/mTW91uN+veVIZe0kosueUXK+Dj5W0ovlR6SSm0D06pxIB2EJc45Thznrvwvh9VwJAbrG0bktzETWmdxtEUOeoSOciZ8dYv078ukX6QncmbQyoXrntGCqO0MFuB1EjqBB0hgWokqZ+E4P/wBk6I5+LtI+NR0Ea10RvtiPMU7RaNtvt6xKFPnIFqFtvrCrZBjzmymmxy9OSmvyiTIuI9Uj1AktrRGyZ5mC1rQHln1ljtIatYCBqCSky+cNpqMb4gT3okJrk7rtGkCrOoABM7c1P5hEme9qAHylELo+ICfm3l+KOXmyi2WkJKtERIc/WEIsqhNIhbiO8ASfhneGYdQP4IihHDFM3V56XMXGYydE6NJbSK5k1GpBp0Rb/jf9bP2fuQwI6y6JB6zA2F06MAhwW2z2E2Vg64G+T1M5eTB18eexXhyVCJFVuF9YG1zvzkI6FtgSN0P0gVO8HUwuncqes1gh61DPIQRqD55YEtGuF8oOXHfM0gUJ4WDviVOpXXhkjpLW/fbYzM65XDYHUTowxc+eWhtnqPvKJpbaqCAZ5xbVDkdpsdOvVKhQekbLDzZMM91ozUGILVvQsDqV8jAO0BqAses5MsfXbj8Wn68HMHeqTBFotCKdFu0xka0yczjqR1xLmhbjG4g1zRUHlDJtPJS6g5RCc7mZp63vZ/ulrrz5PCDy6Sjnbx46xcHJl/ZtbfdUPcQtIHpxzTp/4w9BFoQ8CLEdiOxBs6PEUkxFNtnmcUUU6XO6I6cE7MztN8S/sL8lQi7nvM9iTW1wUYEdIuWO4rhl1rXKrd4mQzunVBVA33lslkMThznWu/C9ptRmk0eHIl09pgQd9PJibOrTUMVO4xDalhgSsuBiHHd8JldeodUvvdbBxMpVrFzknMt9UuRggYlKonbhjqOHky3UiQy1uTTIxA8TuZTScy02Fhcq67HfqIerCY2wrlXG+xmqsX4vOcnLx9fXdxcm1pbU87yySjtykVpT2EsQoxOWr30Mq4lZq2yk8pb1umJUa1TZ6bAc8R8L6TOePPtQrcTn1gbGTXKFWIPPMiInfjrq86+27bDSGzSpnyxLhBKXQD/JQeZl0hiZHxPxOgRCOEQ5vDFH5imZ5hEIop1OY6KKKZinTFFMeNX7L85rliinBzfXdw/HTEYopKLArj4TM1fdYopTj/JPk/Flb7mfWRLFFO/H487P6eZ0RRTAdS5r6zYaJyPrFFI834ujh+tZQ6QvpFFOH9O6fEbwK++E+kUUGH0M/jzPWf6h9YHFFPQx/F5mX2tZ7P8A9JPUy5SKKDI+KdI4RRRDnRRRTM//2Q=="
                alt="Profile"
                width="150px"
                height="150px"
              />
              <div className="font-medium text-3xl mb-1">{infos.username}</div>
            </div>
            <div className="font-medium text-lg">{infos.bio}</div>
            <div className="flex flex-col justify-between dark:shadow-[0_1px_5px_rgb(0,0,0,0.3)] mb-8 mt-8 rounded-lg p-6 gap-4 text-xl text-center shadow-[0_1px_5px_rgb(0,0,0,0.15)]">
              <span className="font-semibold">{infos.matches} Matches</span>
              <span>{infos.wins} Wins</span>
              <span>{infos.draws} Draws</span>
              <span>{infos.losses} Losses</span>
            </div>
          </div>
        )}
      </div>
      <div className="h-full p-4 md:p-8 rounded-lg shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:bg-gray-700 flex-grow md:max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-4 md:mb-7">Stats</h1>
        {infos && (
          <div className="grid grid-cols-4 gap-3 md:gap-4 md:mb-8 mb-4">
            {Object.entries(infos.category).map(([key, category]) => (
              <div
                key={key}
                className="flex flex-col items-center dark:shadow-[0_1px_5px_rgb(0,0,0,0.3)] shadow-[0_1px_5px_rgb(0,0,0,0.15)] p-4 rounded-lg"
              >
                <FontAwesomeIcon
                  icon={category.icon}
                  className="w-8 h-8 text-blue-600"
                />
                <h2 className="text-xl font-bold my-4">{key}</h2>
                <div>{category.elo}</div>
              </div>
            ))}
          </div>
        )}
        <RecentMatches />
      </div>
    </div>
  );
};

export default ProfilePage;
