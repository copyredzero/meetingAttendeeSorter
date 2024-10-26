import React, { useState, useEffect } from 'react';
import { Save, Users, AlertCircle } from 'lucide-react';

function App() {
  const [masterList, setMasterList] = useState('');
  const [attendees, setAttendees] = useState('');
  const [sortedNames, setSortedNames] = useState('');
  const [notFound, setNotFound] = useState<string[]>([]);

  useEffect(() => {
    const savedMasterList = localStorage.getItem('masterList');
    if (savedMasterList) {
      setMasterList(savedMasterList);
    }
  }, []);

  const handleMasterListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMasterList(newValue);
    localStorage.setItem('masterList', newValue);
  };

  const handleAttendeesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAttendees(e.target.value);
  };

  const handleSort = () => {
    // Parse master list maintaining order
    const masterEntries = masterList
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [nickname, fullName] = line.split('=').map(s => s.trim());
        return { nickname, fullName };
      });

    // Create a map for quick lookup
    const masterMap = new Map(
      masterEntries.map(entry => [entry.nickname, entry.fullName])
    );

    // Parse attendees list
    const attendeesList = attendees
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    // Find unmatched nicknames
    const notFoundList = attendeesList.filter(nickname => !masterMap.has(nickname));
    setNotFound(notFoundList);

    // Create a set of present attendees for quick lookup
    const presentAttendees = new Set(attendeesList);

    // Sort according to master list order, only including present attendees
    const sortedAttendees = masterEntries
      .filter(entry => presentAttendees.has(entry.nickname))
      .map(entry => entry.fullName);

    setSortedNames(sortedAttendees.join('、'));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">会议参会人员排序工具</h1>
          <p className="text-gray-600">快速整理并排序会议纪要中的参会人员名单</p>
        </div>

        <div className="space-y-6">
          {/* Master List Input */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <label className="block text-sm font-medium text-gray-700">
                人员名单 (每行一个: 昵称=姓名) 排序因子
              </label>
            </div>
            <textarea
              value={masterList}
              onChange={handleMasterListChange}
              className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="示例:
小张=张三
老李=李四"
            />
          </div>

          {/* Attendees Input */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              输入参会人昵称 (每行输入一个昵称)
            </label>
            <textarea
              value={attendees}
              onChange={handleAttendeesChange}
              className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="示例:
小张
老李"
            />
          </div>

          {/* Sort Button */}
          <button
            onClick={handleSort}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            排序
          </button>

          {/* Results */}
          {sortedNames && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium text-gray-900 mb-3">排序结果:</h2>
              <p className="text-gray-800 p-3 bg-gray-50 rounded-md">{sortedNames}</p>
            </div>
          )}

          {/* Not Found Names */}
          {notFound.length > 0 && (
            <div className="bg-orange-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-medium text-orange-800">未找到的昵称:</h2>
              </div>
              <p className="text-orange-700">{notFound.join('、')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;