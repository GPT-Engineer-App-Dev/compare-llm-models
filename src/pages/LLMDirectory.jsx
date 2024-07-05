import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const mockLLMs = [
  { id: 1, name: 'GPT-3', type: 'GPT', parameters: 175000000000, description: 'OpenAI\'s powerful language model.' },
  { id: 2, name: 'BERT', type: 'BERT', parameters: 340000000, description: 'Google\'s bidirectional transformer model.' },
  { id: 3, name: 'T5', type: 'T5', parameters: 11000000000, description: 'Google\'s Text-to-Text Transfer Transformer.' },
  // Add more mock data as needed
];

const LLMDirectory = () => {
  const [models, setModels] = useState(mockLLMs);
  const [filteredModels, setFilteredModels] = useState(mockLLMs);
  const [selectedModels, setSelectedModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [parameterRange, setParameterRange] = useState([0, 200000000000]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterModels(event.target.value, selectedType, parameterRange);
  };

  const handleTypeSelect = (value) => {
    setSelectedType(value);
    filterModels(searchTerm, value, parameterRange);
  };

  const handleParameterChange = (value) => {
    setParameterRange(value);
    filterModels(searchTerm, selectedType, value);
  };

  const filterModels = (search, type, range) => {
    const filtered = models.filter(model => 
      model.name.toLowerCase().includes(search.toLowerCase()) &&
      (type === '' || model.type === type) &&
      model.parameters >= range[0] && model.parameters <= range[1]
    );
    setFilteredModels(filtered);
  };

  const toggleModelSelection = (model) => {
    setSelectedModels(prev => 
      prev.find(m => m.id === model.id)
        ? prev.filter(m => m.id !== model.id)
        : [...prev, model]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">LLM Directory</h1>
      <p className="text-xl mb-6">Explore and compare various LLM models</p>

      <div className="mb-6 space-y-4">
        <Input
          type="text"
          placeholder="Search models..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
        <Select onValueChange={handleTypeSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select model type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="GPT">GPT</SelectItem>
            <SelectItem value="BERT">BERT</SelectItem>
            <SelectItem value="T5">T5</SelectItem>
          </SelectContent>
        </Select>
        <div>
          <label className="block text-sm font-medium mb-2">Parameter Range</label>
          <Slider
            min={0}
            max={200000000000}
            step={1000000000}
            value={parameterRange}
            onValueChange={handleParameterChange}
          />
          <div className="flex justify-between text-sm mt-1">
            <span>{parameterRange[0].toExponential(2)}</span>
            <span>{parameterRange[1].toExponential(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredModels.map(model => (
          <Card key={model.id}>
            <CardHeader>
              <CardTitle>{model.name}</CardTitle>
              <CardDescription>{model.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Parameters: {model.parameters.toExponential(2)}</p>
              <p>{model.description}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toggleModelSelection(model)}>
                {selectedModels.find(m => m.id === model.id) ? 'Remove from comparison' : 'Add to comparison'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedModels.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Type</th>
                  <th className="border border-gray-300 p-2">Parameters</th>
                  <th className="border border-gray-300 p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {selectedModels.map(model => (
                  <tr key={model.id}>
                    <td className="border border-gray-300 p-2">{model.name}</td>
                    <td className="border border-gray-300 p-2">{model.type}</td>
                    <td className="border border-gray-300 p-2">{model.parameters.toExponential(2)}</td>
                    <td className="border border-gray-300 p-2">{model.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMDirectory;