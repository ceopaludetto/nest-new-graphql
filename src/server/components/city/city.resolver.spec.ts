import { getModelToken } from "@nestjs/sequelize";
import { Test } from "@nestjs/testing";

import { City } from "@/server/models";

import { CityResolver } from "./city.resolver";
import { CityService } from "./city.service";

jest.mock("@/server/models");

describe("CityResolver", () => {
  let cityResolver: CityResolver;
  let cityService: CityService;

  beforeEach(async () => {
    const ref = await Test.createTestingModule({
      providers: [
        CityResolver,
        CityService,
        {
          provide: getModelToken(City),
          useClass: City,
        },
      ],
    }).compile();

    cityResolver = ref.get<CityResolver>(CityResolver);
    cityService = ref.get<CityService>(CityService);
  });

  it("showCities", async () => {
    const result = [new City()];
    jest.spyOn(cityService, "showAll").mockImplementation(() => Promise.resolve(result));

    expect(await cityResolver.showCities({}, { attributes: [], include: [] })).toBe(result);
  });

  it("findCityByID", async () => {
    const result = new City();
    jest.spyOn(cityService, "findByID").mockImplementation(() => Promise.resolve(result));

    expect(await cityResolver.findCityByID({ id: "" }, { attributes: [], include: [] })).toBe(result);
  });

  it("findByState", async () => {
    const result = [new City()];
    jest.spyOn(cityService, "findByState").mockImplementation(() => Promise.resolve(result));

    expect(await cityResolver.findCitiesByStateID({ id: "" }, { attributes: [], include: [] })).toBe(result);
  });
});