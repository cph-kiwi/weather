import type { NextApiRequest, NextApiResponse } from 'next'
import {apiKey} from '../../api_key';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const toCelsius = "&units=metric";

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=${apiKey}${toCelsius}`
    )
      .then((response) => response.json())
      .then((result) => {
        res.status(200).json(result)
      });  
}
